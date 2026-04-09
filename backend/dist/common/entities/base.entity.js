"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const typeorm_1 = require("typeorm");
class BaseEntity extends typeorm_1.BaseEntity {
    id;
    createdAt;
    updatedAt;
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base.entity.js.map