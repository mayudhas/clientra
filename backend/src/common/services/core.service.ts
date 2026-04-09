import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { CoreRepository } from '../repositories/core.repository';
import { BaseEntity } from '../entities/base.entity';

export abstract class CoreService<T extends BaseEntity> {
  constructor(protected readonly repository: CoreRepository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.findAll(options);
  }

  async findById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findById(id, options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
