import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Project } from '../../projects/entities/project.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
export declare class Tenant extends BaseEntity {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    clients: Client[];
    projects: Project[];
    invoices: Invoice[];
}
