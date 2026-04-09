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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    return this.clientsService.createClient(createClientDto, req.user.tenantId);
  }

  @Get()
  findAll(@Request() req) {
    return this.clientsService.findAllByTenant(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientsService.findOneByTenant(id, req.user.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req,
  ) {
    return this.clientsService.updateClient(id, updateClientDto, req.user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientsService.removeClient(id, req.user.tenantId);
  }
}
