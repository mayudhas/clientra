import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums/user-role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: any) {
    // Jika bukan Super Admin, paksa tenantId mengikuti admin yang membuat
    if (user.role !== UserRole.SUPER_ADMIN) {
      (createUserDto as any).tenantId = user.tenantId;
      (createUserDto as any).role = UserRole.MEMBER; // Admin hanya bisa buat Member
    } else if ((createUserDto as any).tenantId === '') {
      // Super Admin sent empty string, treat as null for UUID safety
      (createUserDto as any).tenantId = null;
    }
    return await this.userService.create(createUserDto);
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return await this.userService.findById(user.userId);
  }

  @Put('profile')
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @CurrentUser() user: any) {
    return await this.userService.update(user.userId, updateProfileDto);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser() user: any) {
    try {
      await this.userService.changePassword(
        user.userId,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword,
      );
      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('isActive') isActive: string
  ) {
    const filter: any = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      tenantId: user.role === UserRole.SUPER_ADMIN ? undefined : user.tenantId
    };

    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    return await this.userService.findWithPagination(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const targetUser = await this.userService.findById(id);
    
    // Super Admin bypass
    if (user.role === UserRole.SUPER_ADMIN) return targetUser;

    // Check ownership or same tenant admin
    if (user.userId !== id) {
      if (user.role !== UserRole.ADMIN || targetUser?.tenantId !== user.tenantId) {
        throw new ForbiddenException('You are not allowed to access this user');
      }
    }
    
    return targetUser;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: any) {
    const targetUser = await this.userService.findById(id);
    
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Protection: ordinary admin cannot deactivate super admin
    if (user.role !== UserRole.SUPER_ADMIN && targetUser.role === UserRole.SUPER_ADMIN) {
      if (updateUserDto.isActive === false) {
        throw new ForbiddenException('Ordinary admins cannot deactivate super admins');
      }
    }

    // Super Admin bypass
    if (user.role === UserRole.SUPER_ADMIN) {
        if ((updateUserDto as any).tenantId === '') {
          (updateUserDto as any).tenantId = null;
        }
        return await this.userService.update(id, updateUserDto);
    }

    if (user.userId !== id) {
      if (user.role !== UserRole.ADMIN || targetUser?.tenantId !== user.tenantId) {
        throw new ForbiddenException('You are not allowed to update this user');
      }
    }
    
    // Member tidak boleh ubah role mereka sendiri
    if (user.role === UserRole.MEMBER) {
      delete (updateUserDto as any).role;
    }

    if ((updateUserDto as any).tenantId === '') {
      (updateUserDto as any).tenantId = null;
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Protection: User cannot delete themselves
    if (user.userId === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const targetUser = await this.userService.findById(id);

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (targetUser?.tenantId !== user.tenantId) {
        throw new ForbiddenException('You are not allowed to delete this user');
      }
      
      // Protection: admin cannot delete super admin
      if (targetUser?.role === UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Ordinary admins cannot delete super admins');
      }
    }

    await this.userService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
