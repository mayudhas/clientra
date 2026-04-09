import { Repository } from 'typeorm';
import { CoreRepository } from '../../common/repositories/core.repository';
import { Client } from './entities/client.entity';
export declare class ClientsRepository extends CoreRepository<Client> {
    constructor(repository: Repository<Client>);
}
