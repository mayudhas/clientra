"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactorUserRoleToEnum1775716333000 = void 0;
class RefactorUserRoleToEnum1775716333000 {
    name = 'RefactorUserRoleToEnum1775716333000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "users_users_role_enum" AS ENUM('super_admin', 'admin', 'member')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" TYPE "users_users_role_enum" USING ("users_role"::"users_users_role_enum")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" SET DEFAULT 'member'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" TYPE character varying`);
        await queryRunner.query(`DROP TYPE "users_users_role_enum"`);
    }
}
exports.RefactorUserRoleToEnum1775716333000 = RefactorUserRoleToEnum1775716333000;
//# sourceMappingURL=1775716333000-RefactorUserRoleToEnum.js.map