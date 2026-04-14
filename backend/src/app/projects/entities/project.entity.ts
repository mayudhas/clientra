import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'projects_id' })
  declare id: string;

  @Column({ name: 'projects_name' })
  name: string;

  @Column({ name: 'projects_description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'projects_status',
    type: 'enum',
    enum: ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'planning',
  })
  status: string;

  @Column({
    name: 'projects_priority',
    type: 'enum',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: string;

  @Column({ name: 'projects_budget', type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ name: 'projects_start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'projects_end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: 0, name: 'projects_progress' })
  progress: number;

  @Column({ name: 'projects_client_id', type: 'uuid' })
  clientId: string;

  @Column({ name: 'projects_tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'projects_created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'projects_updated_at' })
  declare updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.projects)
  @JoinColumn({ name: 'projects_client_id' })
  client: Client;

  @ManyToOne(() => Tenant, (tenant) => tenant.projects)
  @JoinColumn({ name: 'projects_tenant_id' })
  tenant: Tenant;
}
