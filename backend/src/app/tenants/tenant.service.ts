import { Injectable, BadRequestException } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { Tenant } from './entities/tenant.entity';
import { TenantRepository } from './tenant.repository';
import { User } from '../users/entities/user.entity';

export interface TenantPaginationFilter {
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable()
export class TenantService extends CoreService<Tenant> {
  constructor(private readonly tenantRepository: TenantRepository) {
    super(tenantRepository);
  }

  async findWithPagination(filter: TenantPaginationFilter) {
    const { page = 1, limit = 10, search } = filter;
    
    const queryBuilder = (this.tenantRepository as any).repository.createQueryBuilder('tenant');
    
    if (search) {
      queryBuilder.where('tenant.name ILIKE :search', { search: `%${search}%` });
    }

    queryBuilder.skip((Number(page) - 1) * Number(limit));
    queryBuilder.take(Number(limit));
    queryBuilder.orderBy('tenant.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    // Map stats to each tenant (user count and client count)
    const itemsWithStats = await Promise.all(items.map(async (tenant: any) => {
      const stats = await this.getTenantStats(tenant.id);
      return {
        ...tenant,
        userCount: stats?.users || 0,
        clientCount: stats?.clients || 0
      };
    }));

    return {
      data: itemsWithStats,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getTenantStats(id: string) {
    const tenant = await this.tenantRepository.findById(id, {
      relations: ['users', 'clients', 'projects', 'invoices']
    });

    if (!tenant) return null;

    return {
      users: tenant.users?.length || 0,
      clients: tenant.clients?.length || 0,
      projects: tenant.projects?.length || 0,
      invoices: tenant.invoices?.length || 0,
    };
  }

  async delete(id: string): Promise<void> {
    const stats = await this.getTenantStats(id);
    if (stats && stats.users > 0) {
      throw new BadRequestException('Cannot delete tenant with active users. Please remove or migrate users first.');
    }
    return super.delete(id);
  }
}
