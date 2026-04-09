import { BaseEntity } from '../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Project } from '../../projects/entities/project.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
export declare class Client extends BaseEntity {
    id: string;
    name: string;
    email: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
    projects: Project[];
    invoices: Invoice[];
}
