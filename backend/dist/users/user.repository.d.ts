import { Repository } from 'typeorm';
import { CoreRepository } from '../common/repositories/core.repository';
import { User } from './entities/user.entity';
export declare class UserRepository extends CoreRepository<User> {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
}
