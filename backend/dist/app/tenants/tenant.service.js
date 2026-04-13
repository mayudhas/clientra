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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const core_service_1 = require("../../common/services/core.service");
const tenant_repository_1 = require("./tenant.repository");
let TenantService = class TenantService extends core_service_1.CoreService {
    tenantRepository;
    constructor(tenantRepository) {
        super(tenantRepository);
        this.tenantRepository = tenantRepository;
    }
    async findWithPagination(filter) {
        const { page = 1, limit = 10, search } = filter;
        const queryBuilder = this.tenantRepository.repository.createQueryBuilder('tenant');
        if (search) {
            queryBuilder.where('tenant.name ILIKE :search', { search: `%${search}%` });
        }
        queryBuilder.skip((Number(page) - 1) * Number(limit));
        queryBuilder.take(Number(limit));
        queryBuilder.orderBy('tenant.createdAt', 'DESC');
        const [items, total] = await queryBuilder.getManyAndCount();
        const itemsWithStats = await Promise.all(items.map(async (tenant) => {
            const stats = await this.getTenantStats(tenant.id);
            return {
                ...tenant,
                userCount: stats?.users || 0,
                clientCount: stats?.clients || 0
            };
        }));
        return {
            data: itemsWithStats,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    async getTenantStats(id) {
        const tenant = await this.tenantRepository.findById(id, {
            relations: ['users', 'clients', 'projects', 'invoices']
        });
        if (!tenant)
            return null;
        return {
            users: tenant.users?.length || 0,
            clients: tenant.clients?.length || 0,
            projects: tenant.projects?.length || 0,
            invoices: tenant.invoices?.length || 0,
        };
    }
    async delete(id) {
        const stats = await this.getTenantStats(id);
        if (stats && stats.users > 0) {
            throw new common_1.BadRequestException('Cannot delete tenant with active users. Please remove or migrate users first.');
        }
        return super.delete(id);
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_repository_1.TenantRepository])
], TenantService);
//# sourceMappingURL=tenant.service.js.map