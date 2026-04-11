import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
        role: import("../../common/enums/user-role.enum").UserRole;
        tenantId?: undefined;
    } | {
        message: string;
        userId: string;
        tenantId: string;
        role: import("../../common/enums/user-role.enum").UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../common/enums/user-role.enum").UserRole;
            tenantId: any;
        };
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../common/enums/user-role.enum").UserRole;
            tenantId: any;
        };
    }>;
}
