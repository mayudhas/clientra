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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const tenant_entity_1 = require("../../tenants/entities/tenant.entity");
const client_entity_1 = require("../../clients/entities/client.entity");
let Project = class Project extends base_entity_1.BaseEntity {
    name;
    progress;
    clientId;
    tenantId;
    client;
    tenant;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'projects_id' }),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'projects_name' }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, name: 'projects_progress' }),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'projects_client_id', type: 'uuid' }),
    __metadata("design:type", String)
], Project.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'projects_tenant_id', type: 'uuid' }),
    __metadata("design:type", String)
], Project.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'projects_created_at' }),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'projects_updated_at' }),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.projects),
    (0, typeorm_1.JoinColumn)({ name: 'projects_client_id' }),
    __metadata("design:type", client_entity_1.Client)
], Project.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.projects),
    (0, typeorm_1.JoinColumn)({ name: 'projects_tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Project.prototype, "tenant", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=project.entity.js.map