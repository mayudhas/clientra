"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1775621111891 = void 0;
class InitialSchema1775621111891 {
    name = 'InitialSchema1775621111891';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "fullName" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialSchema1775621111891 = InitialSchema1775621111891;
//# sourceMappingURL=1775621111891-InitialSchema.js.map