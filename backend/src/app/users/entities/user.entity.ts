import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'users_id' })
  declare id: string;

  @Column({ name: 'users_name' })
  name: string;

  @Column({ unique: true, name: 'users_email' })
  email: string;

  @Exclude()
  @Column({ name: 'users_password' })
  password: string;

  @Column({ default: 'member', name: 'users_role' })
  role: string;

  @Column({ name: 'users_tenant_id', nullable: true, type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ name: 'users_created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'users_updated_at' })
  declare updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({ name: 'users_tenant_id' })
  tenant: Tenant;
}
