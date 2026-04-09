import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreRepository } from '../../common/repositories/core.repository';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsRepository extends CoreRepository<Client> {
  constructor(
    @InjectRepository(Client)
    repository: Repository<Client>,
  ) {
    super(repository);
  }
}
