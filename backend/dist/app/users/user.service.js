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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const core_service_1 = require("../../common/services/core.service");
const user_repository_1 = require("./user.repository");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService extends core_service_1.CoreService {
    userRepository;
    constructor(userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findWithPagination(filter) {
        const { page = 1, limit = 10, search, tenantId } = filter;
        const queryBuilder = this.userRepository.repository.createQueryBuilder('user');
        if (filter.isActive !== undefined) {
            queryBuilder.where('user.isActive = :isActive', { isActive: filter.isActive });
        }
        else {
            queryBuilder.where('1=1');
        }
        if (tenantId !== undefined) {
            if (tenantId === null) {
                queryBuilder.andWhere('user.tenantId IS NULL');
            }
            else {
                queryBuilder.andWhere('user.tenantId = :tenantId', { tenantId });
            }
        }
        if (search) {
            queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.skip((Number(page) - 1) * Number(limit));
        queryBuilder.take(Number(limit));
        queryBuilder.orderBy('user.createdAt', 'DESC');
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            data: items,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    async create(data) {
        if (data.password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password, salt);
        }
        return super.create(data);
    }
    async update(id, data) {
        if (data.password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password, salt);
        }
        else {
            delete data.password;
        }
        return super.update(id, data);
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.userRepository.update(id, { password: hashedPassword });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map