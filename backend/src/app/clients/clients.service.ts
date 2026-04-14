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

  async createClient(createClientDto: CreateClientDto, currentTenantId: string | null): Promise<Client> {
    const finalTenantId = createClientDto.tenantId || currentTenantId;
    
    if (!finalTenantId) {
      throw new Error('Tenant ID is required to create a client');
    }

    const { tenantId, ...rest } = createClientDto;
    return await super.create({
      ...rest,
      tenantId: finalTenantId,
    });
  }

  async findAllByTenant(tenantId: string | null): Promise<Client[]> {
    const findOptions: any = {
      order: { createdAt: 'DESC' },
      relations: ['tenant'],
    };

    if (tenantId) {
      findOptions.where = { tenantId };
    }

    return await super.findAll(findOptions);
  }

  async findOneByTenant(id: string, tenantId: string | null): Promise<Client> {
    const findOptions: any = {
      where: { id },
    };

    if (tenantId) {
      findOptions.where.tenantId = tenantId;
    }

    const client = await this.clientsRepository.findById(id, findOptions);

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    return client;
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto, tenantId: string | null): Promise<Client | null> {
    await this.findOneByTenant(id, tenantId);
    
    const { tenantId: dtoTenantId, ...rest } = updateClientDto as any;
    const finalData = { ...rest };
    if (dtoTenantId && tenantId === null) { // Only super admins (tenantId null) can update tenantId
      finalData.tenantId = dtoTenantId;
    }

    return await super.update(id, finalData);
  }

  async removeClient(id: string, tenantId: string | null): Promise<void> {
    await this.findOneByTenant(id, tenantId);
    return await super.delete(id);
  }
}
