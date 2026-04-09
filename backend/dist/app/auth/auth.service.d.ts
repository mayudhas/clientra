import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { TenantService } from '../tenants/tenant.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly userService;
    private readonly tenantService;
    constructor(jwtService: JwtService, userService: UserService, tenantService: TenantService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
        role: string;
        tenantId?: undefined;
    } | {
        message: string;
        userId: string;
        tenantId: string;
        role: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            tenantId: any;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            tenantId: any;
        };
    }>;
    private generateTokens;
}
