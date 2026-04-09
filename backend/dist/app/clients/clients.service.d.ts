import { CoreService } from '../../common/services/core.service';
import { Client } from './entities/client.entity';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsService extends CoreService<Client> {
    protected readonly clientsRepository: ClientsRepository;
    constructor(clientsRepository: ClientsRepository);
    createClient(createClientDto: CreateClientDto, tenantId: string): Promise<Client>;
    findAllByTenant(tenantId: string): Promise<Client[]>;
    findOneByTenant(id: string, tenantId: string): Promise<Client>;
    updateClient(id: string, updateClientDto: UpdateClientDto, tenantId: string): Promise<Client | null>;
    removeClient(id: string, tenantId: string): Promise<void>;
}
