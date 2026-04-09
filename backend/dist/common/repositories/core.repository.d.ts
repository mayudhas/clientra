import { Repository, DeepPartial, FindOneOptions, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
export declare abstract class CoreRepository<T extends BaseEntity> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findById(id: any, options?: FindOneOptions<T>): Promise<T | null>;
    create(data: DeepPartial<T>): Promise<T>;
    update(id: any, data: DeepPartial<T>): Promise<T | null>;
    delete(id: any): Promise<void>;
}
