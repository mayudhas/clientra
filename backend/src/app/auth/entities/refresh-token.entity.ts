import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid', { name: 'rt_id' })
  id: string;

  @Column({ name: 'rt_token', unique: true })
  token: string;

  @Column({ name: 'rt_user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'rt_expires_at' })
  expiresAt: Date;

  @Column({ name: 'rt_is_revoked', default: false })
  isRevoked: boolean;

  @CreateDateColumn({ name: 'rt_created_at' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rt_user_id' })
  user: User;
}
