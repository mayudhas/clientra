import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreRepository } from '../../common/repositories/core.repository';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantRepository extends CoreRepository<Tenant> {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {
    super(tenantRepository);
  }
}
