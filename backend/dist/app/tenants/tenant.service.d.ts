import { CoreService } from '../../common/services/core.service';
import { Tenant } from './entities/tenant.entity';
import { TenantRepository } from './tenant.repository';
export interface TenantPaginationFilter {
    page?: number;
    limit?: number;
    search?: string;
}
export declare class TenantService extends CoreService<Tenant> {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    findWithPagination(filter: TenantPaginationFilter): Promise<{
        data: any[];
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTenantStats(id: string): Promise<{
        users: number;
        clients: number;
        projects: number;
        invoices: number;
    } | null>;
    delete(id: string): Promise<void>;
}
