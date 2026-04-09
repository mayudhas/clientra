import { BaseEntity } from '../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Client } from '../../clients/entities/client.entity';
export declare class Invoice extends BaseEntity {
    id: string;
    amount: number;
    status: string;
    clientId: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    client: Client;
    tenant: Tenant;
}
