import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('password_resets')
@Index(['email', 'token'], { unique: true })
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid', { name: 'pr_id' })
  id: string;

  @Column({ name: 'pr_email' })
  email: string;

  @Column({ name: 'pr_token' })
  token: string;

  @Column({ type: 'timestamp', name: 'pr_expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'pr_created_at' })
  createdAt: Date;
}
