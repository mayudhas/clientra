import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { UserRole } from '../../../common/enums/user-role.enum';
export declare class User extends BaseEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
}
