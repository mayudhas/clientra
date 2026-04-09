import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
export declare class User extends BaseEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
}
