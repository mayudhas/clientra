import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
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
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly mailService: MailService,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Periksa apakah pengguna dengan email tersebut sudah terdaftar
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // 2. Cek apakah ini pendaftaran Super Admin
    if (registerDto.setupKey === (process.env.SETUP_KEY || 'clientra_super_secret')) {
      const superAdminUser = await this.userService.create({
        email: registerDto.email,
        name: registerDto.name,
        password: registerDto.password, // Raw password, UserService.create will hash it
        role: UserRole.SUPER_ADMIN,
      });

      return {
        message: 'Super Admin created successfully',
        userId: superAdminUser.id,
        role: superAdminUser.role,
      };
    }

    // 3. Jika bukan super admin, maka wajib ada tenantName
    if (!registerDto.tenantName) {
      throw new BadRequestException('tenantName is required for standard registration');
    }

    const tenant = await this.tenantService.create({ name: registerDto.tenantName });
    const user = await this.userService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password, // Raw password, UserService.create will hash it
      role: UserRole.ADMIN, // Admin di level tenant
      tenant: tenant as any,
    });

    return {
      message: 'User and Tenant created successfully',
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Temukan user 
    const userDetail = await this.userService.findByEmail(loginDto.email);
    
    if (!userDetail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!userDetail.isActive) {
      throw new UnauthorizedException('User account has been deactivated');
    }

    // 2. Bandingkan Password
    const passwordValid = await bcrypt.compare(loginDto.password, userDetail.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Rilis token
    return this.generateTokens(userDetail);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
      });

      // Check database for token and revocation status
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { 
          token: refreshTokenDto.refreshToken,
          userId: payload.sub,
          isRevoked: false 
        }
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        if (storedToken) {
          await this.refreshTokenRepository.delete(storedToken.id);
        }
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists.');
      }

      // Revoke the old token after successful refresh (Rotation)
      await this.refreshTokenRepository.update(storedToken.id, { isRevoked: true });

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, logoutDto: LogoutDto) {
    const { refreshToken } = logoutDto;
    
    // Mark the specific refresh token as revoked
    await this.refreshTokenRepository.update(
      { token: refreshToken, userId },
      { isRevoked: true }
    );

    return {
      message: 'Logged out successfully',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    
    // For security reasons, we should not reveal if the email exists or not
    // But since this is a private internal application, we can be more explicit
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    await this.passwordResetRepository.save({
      email: user.email,
      token: token,
      expiresAt: expiresAt,
    });

    await this.mailService.sendPasswordResetEmail(user.email, token);

    return {
      message: 'Password reset link has been sent to your email',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const resetRequest = await this.passwordResetRepository.findOne({
      where: { token },
    });

    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (resetRequest.expiresAt < new Date()) {
      await this.passwordResetRepository.delete(resetRequest.id);
      throw new BadRequestException('Password reset token has expired');
    }

    const user = await this.userService.findByEmail(resetRequest.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user password - UserService.update handles hashing
    await this.userService.update(user.id, { password: newPassword });

    // Clean up reset token
    await this.passwordResetRepository.delete(resetRequest.id);

    return {
      message: 'Password has been successfully updated',
    };
  }

  private async generateTokens(user: User) {
    // Debug: Log the user object to see why tenantId might be missing
    console.log('[AuthService] Generating tokens for user:', {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: (user as any).tenantId,
      tenant: (user as any).tenant?.id,
      keys: Object.keys(user)
    });

    const tenantIdField = (user as any).tenantId || (user as any).tenant?.id || (user as any).users_tenant_id || null;

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: tenantIdField,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
      expiresIn: '7d', // Refresh token umur 7 hari
    });

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await this.refreshTokenRepository.save({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: tenantIdField,
      },
    };
  }
}
