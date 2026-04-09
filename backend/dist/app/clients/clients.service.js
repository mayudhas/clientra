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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const core_service_1 = require("../../common/services/core.service");
const clients_repository_1 = require("./clients.repository");
let ClientsService = class ClientsService extends core_service_1.CoreService {
    clientsRepository;
    constructor(clientsRepository) {
        super(clientsRepository);
        this.clientsRepository = clientsRepository;
    }
    async createClient(createClientDto, tenantId) {
        return await super.create({
            ...createClientDto,
            tenantId,
        });
    }
    async findAllByTenant(tenantId) {
        return await super.findAll({
            where: { tenantId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOneByTenant(id, tenantId) {
        const client = await this.clientsRepository.findById(id, {
            where: { id, tenantId },
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID "${id}" not found`);
        }
        return client;
    }
    async updateClient(id, updateClientDto, tenantId) {
        await this.findOneByTenant(id, tenantId);
        return await super.update(id, updateClientDto);
    }
    async removeClient(id, tenantId) {
        await this.findOneByTenant(id, tenantId);
        return await super.delete(id);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map