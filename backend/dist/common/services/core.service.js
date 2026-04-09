"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreService = void 0;
class CoreService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(options) {
        return await this.repository.findAll(options);
    }
    async findById(id, options) {
        return await this.repository.findById(id, options);
    }
    async create(data) {
        return await this.repository.create(data);
    }
    async update(id, data) {
        return await this.repository.update(id, data);
    }
    async delete(id) {
        return await this.repository.delete(id);
    }
}
exports.CoreService = CoreService;
//# sourceMappingURL=core.service.js.map