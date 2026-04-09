"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddClientFields1775716229681 = void 0;
class AddClientFields1775716229681 {
    name = 'AddClientFields1775716229681';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_company" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_address" text`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_notes" text`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_status" character varying(20) NOT NULL DEFAULT 'active'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_status"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_notes"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_address"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_phone"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_company"`);
    }
}
exports.AddClientFields1775716229681 = AddClientFields1775716229681;
//# sourceMappingURL=1775716229681-AddClientFields.js.map