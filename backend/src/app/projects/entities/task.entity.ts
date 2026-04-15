import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Project } from './project.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'tasks_id' })
  declare id: string;

  @Column({ name: 'tasks_title' })
  title: string;

  @Column({ name: 'tasks_description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'tasks_status',
    type: 'enum',
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
  })
  status: string;

  @Column({
    name: 'tasks_priority',
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: string;

  @Column({ name: 'tasks_due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'tasks_project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'tasks_tenant_id', type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'tasks_created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'tasks_updated_at' })
  declare updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tasks_project_id' })
  project: Project;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tasks_tenant_id' })
  tenant: Tenant;
}
