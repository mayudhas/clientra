import { Injectable } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { DeepPartial } from 'typeorm';

export interface PaginationFilter {
  page?: number;
  limit?: number;
  search?: string;
  tenantId?: string | null;
  isActive?: boolean;
}

@Injectable()
export class UserService extends CoreService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findWithPagination(filter: PaginationFilter) {
    const { page = 1, limit = 10, search, tenantId } = filter;
    
    // We access the underlying TypeORM repository via 'repository' generic from CoreRepository.
    // CoreRepository uses 'repository' property internally.
    const queryBuilder = (this.userRepository as any).repository.createQueryBuilder('user')
      .leftJoinAndSelect('user.tenant', 'tenant');
    
    // Default: Only filter if isActive is explicitly sent, otherwise show all to admins
    if (filter.isActive !== undefined) {
      queryBuilder.where('user.isActive = :isActive', { isActive: filter.isActive });
    } else {
      queryBuilder.where('1=1'); // Dummy where to start the chain
    }

    if (tenantId !== undefined) {
       // if exact null is sent, meaning we filter where tenantId is null
       if (tenantId === null) {
          queryBuilder.andWhere('user.tenantId IS NULL');
       } else {
          queryBuilder.andWhere('user.tenantId = :tenantId', { tenantId });
       }
    }

    if (search) {
      queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }

    queryBuilder.skip((Number(page) - 1) * Number(limit));
    queryBuilder.take(Number(limit));
    queryBuilder.orderBy('user.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async create(data: DeepPartial<User>): Promise<User> {
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }
    return super.create(data);
  }

  async update(id: string, data: DeepPartial<User>): Promise<User | null> {
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      // If password string is empty or undefined, remove it so it won't be replaced with empty
      delete data.password;
    }
    return super.update(id, data);
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.userRepository.update(id, { password: hashedPassword } as any);
  }
}
