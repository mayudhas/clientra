import { Entity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Project } from '../../projects/entities/project.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'clients_id' })
  declare id: string;

  @Column({ name: 'clients_name' })
  name: string;

  @Column({ name: 'clients_email', nullable: true })
  email: string;

  @Column({ name: 'clients_tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'clients_created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'clients_updated_at' })
  declare updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.clients)
  @JoinColumn({ name: 'clients_tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];
}
