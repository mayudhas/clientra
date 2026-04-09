import { Injectable } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { Tenant } from './entities/tenant.entity';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantService extends CoreService<Tenant> {
  constructor(private readonly tenantRepository: TenantRepository) {
    super(tenantRepository);
  }
}
