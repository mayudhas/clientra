import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant to manage clients.');
    }
    return this.clientsService.createClient(createClientDto, tenantId);
  }

  @Get()
  findAll(@Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      return []; // Return empty list for users without a tenant
    }
    return this.clientsService.findAllByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;
    return this.clientsService.findOneByTenant(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req,
  ) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant to manage clients.');
    }
    return this.clientsService.updateClient(id, updateClientDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const isSuperAdmin = req.user.role === UserRole.SUPER_ADMIN;
    const tenantId = isSuperAdmin ? null : req.user.tenantId;

    if (!isSuperAdmin && !tenantId) {
      throw new BadRequestException('Action denied: You must be associated with a tenant to manage clients.');
    }
    return this.clientsService.removeClient(id, tenantId);
  }
}
