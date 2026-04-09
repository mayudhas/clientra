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
exports.Client = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const tenant_entity_1 = require("../../tenants/entities/tenant.entity");
const project_entity_1 = require("../../projects/entities/project.entity");
const invoice_entity_1 = require("../../invoices/entities/invoice.entity");
let Client = class Client extends base_entity_1.BaseEntity {
    name;
    email;
    company;
    phone;
    address;
    notes;
    status;
    tenantId;
    tenant;
    projects;
    invoices;
};
exports.Client = Client;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'clients_id' }),
    __metadata("design:type", String)
], Client.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_name' }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_email', nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_company', nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_phone', nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_status', length: 20, default: 'active' }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clients_tenant_id', type: 'uuid' }),
    __metadata("design:type", String)
], Client.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'clients_created_at' }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'clients_updated_at' }),
    __metadata("design:type", Date)
], Client.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.clients),
    (0, typeorm_1.JoinColumn)({ name: 'clients_tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Client.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, (project) => project.client),
    __metadata("design:type", Array)
], Client.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_1.Invoice, (invoice) => invoice.client),
    __metadata("design:type", Array)
], Client.prototype, "invoices", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)('clients')
], Client);
//# sourceMappingURL=client.entity.js.map