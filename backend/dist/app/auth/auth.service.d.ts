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
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    private generateTokens;
}
