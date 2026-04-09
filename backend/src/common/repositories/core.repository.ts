import { Repository, DeepPartial, FindOneOptions, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export abstract class CoreRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findById(id: any, options?: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as any,
      ...options,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id: any, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: any): Promise<void> {
    await this.repository.delete(id);
  }
}
