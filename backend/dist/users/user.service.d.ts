import { CoreService } from '../common/services/core.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
export declare class UserService extends CoreService<User> {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findByEmail(email: string): Promise<User | null>;
}
