import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { TenantService } from '../tenants/tenant.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Periksa apakah pengguna dengan email tersebut sudah terdaftar
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // 3. Cek apakah ini pendaftaran Super Admin
    if (registerDto.setupKey === (process.env.SETUP_KEY || 'clientra_super_secret')) {
      const superAdminUser = await this.userService.create({
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      });

      return {
        message: 'Super Admin created successfully',
        userId: superAdminUser.id,
        role: superAdminUser.role,
      };
    }

    // 4. Jika bukan super admin, maka wajib ada tenantName
    if (!registerDto.tenantName) {
      throw new BadRequestException('tenantName is required for standard registration');
    }

    const tenant = await this.tenantService.create({ name: registerDto.tenantName });
    const user = await this.userService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
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
      // Validasi token yang dilempar
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists.');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: User) {
    // Memilih tenant id dari entity jika di join (butuh query relations aslinya).
    // Tapi untuk JWT payload kita coba ambil dari user parameter aja
    const tenantIdField = user['tenant']?.id || user['users_tenant_id'] || null;

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
