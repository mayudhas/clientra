import { CoreService } from '../../common/services/core.service';
import { Tenant } from './entities/tenant.entity';
import { TenantRepository } from './tenant.repository';
export declare class TenantService extends CoreService<Tenant> {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
}
