import { Repository } from 'typeorm';
import { CoreRepository } from '../../common/repositories/core.repository';
import { Tenant } from './entities/tenant.entity';
export declare class TenantRepository extends CoreRepository<Tenant> {
    private readonly tenantRepository;
    constructor(tenantRepository: Repository<Tenant>);
}
