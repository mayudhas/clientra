import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Project } from '../../projects/entities/project.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'tenants_id' })
  declare id: string;

  @Column({ name: 'tenants_name' })
  name: string;

  @CreateDateColumn({ name: 'tenants_created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'tenants_updated_at' })
  declare updatedAt: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Client, (client) => client.tenant)
  clients: Client[];

  @OneToMany(() => Project, (project) => project.tenant)
  projects: Project[];

  @OneToMany(() => Invoice, (invoice) => invoice.tenant)
  invoices: Invoice[];
}
