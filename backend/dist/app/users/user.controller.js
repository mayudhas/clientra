"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto, user) {
        if (user.role !== user_role_enum_1.UserRole.SUPER_ADMIN) {
            createUserDto.tenantId = user.tenantId;
            createUserDto.role = user_role_enum_1.UserRole.MEMBER;
        }
        else if (createUserDto.tenantId === '') {
            createUserDto.tenantId = null;
        }
        return await this.userService.create(createUserDto);
    }
    async getProfile(user) {
        return await this.userService.findById(user.userId);
    }
    async updateProfile(updateProfileDto, user) {
        return await this.userService.update(user.userId, updateProfileDto);
    }
    async changePassword(changePasswordDto, user) {
        try {
            await this.userService.changePassword(user.userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(user, page, limit, search, isActive) {
        const filter = {
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
            search,
            tenantId: user.role === user_role_enum_1.UserRole.SUPER_ADMIN ? undefined : user.tenantId
        };
        if (isActive !== undefined && isActive !== '') {
            filter.isActive = isActive === 'true';
        }
        return await this.userService.findWithPagination(filter);
    }
    async findOne(id, user) {
        const targetUser = await this.userService.findById(id);
        if (user.role === user_role_enum_1.UserRole.SUPER_ADMIN)
            return targetUser;
        if (user.userId !== id) {
            if (user.role !== user_role_enum_1.UserRole.ADMIN || targetUser?.tenantId !== user.tenantId) {
                throw new common_1.ForbiddenException('You are not allowed to access this user');
            }
        }
        return targetUser;
    }
    async update(id, updateUserDto, user) {
        const targetUser = await this.userService.findById(id);
        if (!targetUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== user_role_enum_1.UserRole.SUPER_ADMIN && targetUser.role === user_role_enum_1.UserRole.SUPER_ADMIN) {
            if (updateUserDto.isActive === false) {
                throw new common_1.ForbiddenException('Ordinary admins cannot deactivate super admins');
            }
        }
        if (user.role === user_role_enum_1.UserRole.SUPER_ADMIN) {
            if (updateUserDto.tenantId === '') {
                updateUserDto.tenantId = null;
            }
            return await this.userService.update(id, updateUserDto);
        }
        if (user.userId !== id) {
            if (user.role !== user_role_enum_1.UserRole.ADMIN || targetUser?.tenantId !== user.tenantId) {
                throw new common_1.ForbiddenException('You are not allowed to update this user');
            }
        }
        if (user.role === user_role_enum_1.UserRole.MEMBER) {
            delete updateUserDto.role;
        }
        if (updateUserDto.tenantId === '') {
            updateUserDto.tenantId = null;
        }
        return await this.userService.update(id, updateUserDto);
    }
    async remove(id, user) {
        if (user.userId === id) {
            throw new common_1.ForbiddenException('You cannot delete your own account');
        }
        const targetUser = await this.userService.findById(id);
        if (user.role !== user_role_enum_1.UserRole.SUPER_ADMIN) {
            if (targetUser?.tenantId !== user.tenantId) {
                throw new common_1.ForbiddenException('You are not allowed to delete this user');
            }
            if (targetUser?.role === user_role_enum_1.UserRole.SUPER_ADMIN) {
                throw new common_1.ForbiddenException('Ordinary admins cannot delete super admins');
            }
        }
        await this.userService.delete(id);
        return { message: 'User deleted successfully' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map