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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_service_1 = require("../users/user.service");
const tenant_service_1 = require("../tenants/tenant.service");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let AuthService = class AuthService {
    jwtService;
    userService;
    tenantService;
    constructor(jwtService, userService, tenantService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.tenantService = tenantService;
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
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User no longer exists.');
            }
            return this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
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
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        tenant_service_1.TenantService])
], AuthService);
//# sourceMappingURL=auth.service.js.map