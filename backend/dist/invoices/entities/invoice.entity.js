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
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const tenant_entity_1 = require("../../tenants/entities/tenant.entity");
const client_entity_1 = require("../../clients/entities/client.entity");
let Invoice = class Invoice extends base_entity_1.BaseEntity {
    amount;
    status;
    clientId;
    tenantId;
    client;
    tenant;
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'invoices_id' }),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoices_amount' }),
    __metadata("design:type", Number)
], Invoice.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoices_status' }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoices_client_id', type: 'uuid' }),
    __metadata("design:type", String)
], Invoice.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoices_tenant_id', type: 'uuid' }),
    __metadata("design:type", String)
], Invoice.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'invoices_created_at' }),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'invoices_updated_at' }),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.invoices),
    (0, typeorm_1.JoinColumn)({ name: 'invoices_client_id' }),
    __metadata("design:type", client_entity_1.Client)
], Invoice.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.invoices),
    (0, typeorm_1.JoinColumn)({ name: 'invoices_tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Invoice.prototype, "tenant", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)('invoices')
], Invoice);
//# sourceMappingURL=invoice.entity.js.map