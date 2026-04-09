import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'invoices_id' })
  declare id: string;

  @Column({ name: 'invoices_amount' })
  amount: number;

  @Column({ name: 'invoices_status' })
  status: string;

  @Column({ name: 'invoices_client_id', type: 'uuid' })
  clientId: string;

  @Column({ name: 'invoices_tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'invoices_created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'invoices_updated_at' })
  declare updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.invoices)
  @JoinColumn({ name: 'invoices_client_id' })
  client: Client;

  @ManyToOne(() => Tenant, (tenant) => tenant.invoices)
  @JoinColumn({ name: 'invoices_tenant_id' })
  tenant: Tenant;
}
