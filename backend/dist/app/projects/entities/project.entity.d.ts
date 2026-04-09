import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Client } from '../../clients/entities/client.entity';
export declare class Project extends BaseEntity {
    id: string;
    name: string;
    progress: number;
    clientId: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    client: Client;
    tenant: Tenant;
}
