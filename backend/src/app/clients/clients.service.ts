import { Injectable, NotFoundException } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { Client } from './entities/client.entity';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService extends CoreService<Client> {
  constructor(protected readonly clientsRepository: ClientsRepository) {
    super(clientsRepository);
  }

  async createClient(createClientDto: CreateClientDto, tenantId: string): Promise<Client> {
    return await super.create({
      ...createClientDto,
      tenantId,
    });
  }

  async findAllByTenant(tenantId: string): Promise<Client[]> {
    return await super.findAll({
      where: { tenantId } as any,
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findOneByTenant(id: string, tenantId: string): Promise<Client> {
    const client = await this.clientsRepository.findById(id, {
      where: { id, tenantId } as any,
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    return client;
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto, tenantId: string): Promise<Client | null> {
    await this.findOneByTenant(id, tenantId);
    return await super.update(id, updateClientDto);
  }

  async removeClient(id: string, tenantId: string): Promise<void> {
    await this.findOneByTenant(id, tenantId);
    return await super.delete(id);
  }
}
