import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { TenantService } from '../tenants/tenant.service';
import { MailService } from '../../common/mail/mail.service';
import { PasswordReset } from './entities/password-reset.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserRole } from '../../common/enums/user-role.enum';
export declare class AuthService {
    private readonly jwtService;
    private readonly userService;
    private readonly tenantService;
    private readonly mailService;
    private readonly passwordResetRepository;
    private readonly refreshTokenRepository;
    constructor(jwtService: JwtService, userService: UserService, tenantService: TenantService, mailService: MailService, passwordResetRepository: Repository<PasswordReset>, refreshTokenRepository: Repository<RefreshToken>);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
        role: UserRole;
        tenantId?: undefined;
    } | {
        message: string;
        userId: string;
        tenantId: string;
        role: UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
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
            role: UserRole;
            tenantId: any;
        };
    }>;
    logout(userId: string, logoutDto: LogoutDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
}
