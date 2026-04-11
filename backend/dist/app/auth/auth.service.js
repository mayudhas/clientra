"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../users/user.service");
const tenant_service_1 = require("../tenants/tenant.service");
const mail_service_1 = require("../../common/mail/mail.service");
const password_reset_entity_1 = require("./entities/password-reset.entity");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let AuthService = class AuthService {
    jwtService;
    userService;
    tenantService;
    mailService;
    passwordResetRepository;
    refreshTokenRepository;
    constructor(jwtService, userService, tenantService, mailService, passwordResetRepository, refreshTokenRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.tenantService = tenantService;
        this.mailService = mailService;
        this.passwordResetRepository = passwordResetRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    async register(registerDto) {
        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(registerDto.password, salt);
        if (registerDto.setupKey === (process.env.SETUP_KEY || 'clientra_super_secret')) {
            const superAdminUser = await this.userService.create({
                email: registerDto.email,
                name: registerDto.name,
                password: hashedPassword,
                role: user_role_enum_1.UserRole.SUPER_ADMIN,
            });
            return {
                message: 'Super Admin created successfully',
                userId: superAdminUser.id,
                role: superAdminUser.role,
            };
        }
        if (!registerDto.tenantName) {
            throw new common_1.BadRequestException('tenantName is required for standard registration');
        }
        const tenant = await this.tenantService.create({ name: registerDto.tenantName });
        const user = await this.userService.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: user_role_enum_1.UserRole.ADMIN,
            tenant: tenant,
        });
        return {
            message: 'User and Tenant created successfully',
            userId: user.id,
            tenantId: tenant.id,
            role: user.role,
        };
    }
    async login(loginDto) {
        const userDetail = await this.userService.findByEmail(loginDto.email);
        if (!userDetail) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!userDetail.isActive) {
            throw new common_1.UnauthorizedException('User account has been deactivated');
        }
        const passwordValid = await bcrypt.compare(loginDto.password, userDetail.password);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(userDetail);
    }
    async refreshToken(refreshTokenDto) {
        try {
            const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
            });
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
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User no longer exists.');
            }
            await this.refreshTokenRepository.update(storedToken.id, { isRevoked: true });
            return this.generateTokens(user);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId, logoutDto) {
        const { refreshToken } = logoutDto;
        await this.refreshTokenRepository.update({ token: refreshToken, userId }, { isRevoked: true });
        return {
            message: 'Logged out successfully',
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.userService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new common_1.NotFoundException('User with this email does not exist');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
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
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const resetRequest = await this.passwordResetRepository.findOne({
            where: { token },
        });
        if (!resetRequest) {
            throw new common_1.BadRequestException('Invalid or expired password reset token');
        }
        if (resetRequest.expiresAt < new Date()) {
            await this.passwordResetRepository.delete(resetRequest.id);
            throw new common_1.BadRequestException('Password reset token has expired');
        }
        const user = await this.userService.findByEmail(resetRequest.email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userService.update(user.id, { password: newPassword });
        await this.passwordResetRepository.delete(resetRequest.id);
        return {
            message: 'Password has been successfully updated',
        };
    }
    async generateTokens(user) {
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
            expiresIn: '7d',
        });
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(password_reset_entity_1.PasswordReset)),
    __param(5, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        tenant_service_1.TenantService,
        mail_service_1.MailService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map