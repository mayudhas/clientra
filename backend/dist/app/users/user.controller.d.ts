import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto, user: any): Promise<import("./entities/user.entity").User>;
    getProfile(user: any): Promise<import("./entities/user.entity").User | null>;
    updateProfile(updateProfileDto: UpdateProfileDto, user: any): Promise<import("./entities/user.entity").User | null>;
    changePassword(changePasswordDto: ChangePasswordDto, user: any): Promise<{
        message: string;
    }>;
    findAll(user: any, page: string, limit: string, search: string, isActive: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: any): Promise<import("./entities/user.entity").User | null>;
    update(id: string, updateUserDto: UpdateUserDto, user: any): Promise<import("./entities/user.entity").User | null>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
