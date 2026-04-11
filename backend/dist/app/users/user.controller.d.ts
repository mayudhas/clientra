import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto, user: any): Promise<import("./entities/user.entity").User>;
    findAll(user: any): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string, user: any): Promise<import("./entities/user.entity").User | null>;
    update(id: string, updateUserDto: UpdateUserDto, user: any): Promise<import("./entities/user.entity").User | null>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
