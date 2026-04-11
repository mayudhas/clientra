import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { UserRole } from '../../../common/enums/user-role.enum';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
export declare class User extends BaseEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    tenantId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
    refreshTokens: RefreshToken[];
}
