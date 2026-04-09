"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreRepository = void 0;
class CoreRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(options) {
        return await this.repository.find(options);
    }
    async findById(id, options) {
        return await this.repository.findOne({
            where: { id },
            ...options,
        });
    }
    async create(data) {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.CoreRepository = CoreRepository;
//# sourceMappingURL=core.repository.js.map