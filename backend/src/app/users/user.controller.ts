import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    }
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@CurrentUser() user: any) {
    if (user.role === UserRole.SUPER_ADMIN) {
      return await this.userService.findAll();
    }
    return await this.userService.findAll({ where: { tenantId: user.tenantId } as any });
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
    
    // Super Admin bypass
    if (user.role === UserRole.SUPER_ADMIN) {
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

    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const targetUser = await this.userService.findById(id);

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (targetUser?.tenantId !== user.tenantId) {
        throw new ForbiddenException('You are not allowed to delete this user');
      }
    }

    await this.userService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
