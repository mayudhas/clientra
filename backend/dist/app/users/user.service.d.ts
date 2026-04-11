import { CoreService } from '../../common/services/core.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { DeepPartial } from 'typeorm';
export interface PaginationFilter {
    page?: number;
    limit?: number;
    search?: string;
    tenantId?: string | null;
    isActive?: boolean;
}
export declare class UserService extends CoreService<User> {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findByEmail(email: string): Promise<User | null>;
    findWithPagination(filter: PaginationFilter): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(data: DeepPartial<User>): Promise<User>;
    update(id: string, data: DeepPartial<User>): Promise<User | null>;
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
}
