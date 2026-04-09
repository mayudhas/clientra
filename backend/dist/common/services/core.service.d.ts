import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { CoreRepository } from '../repositories/core.repository';
import { BaseEntity } from '../entities/base.entity';
export declare abstract class CoreService<T extends BaseEntity> {
    protected readonly repository: CoreRepository<T>;
    constructor(repository: CoreRepository<T>);
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findById(id: string, options?: FindOneOptions<T>): Promise<T | null>;
    create(data: DeepPartial<T>): Promise<T>;
    update(id: string, data: DeepPartial<T>): Promise<T | null>;
    delete(id: string): Promise<void>;
}
