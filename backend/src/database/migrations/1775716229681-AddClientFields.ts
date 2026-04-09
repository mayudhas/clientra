import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClientFields1775716229681 implements MigrationInterface {
    name = 'AddClientFields1775716229681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_company" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_address" text`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_notes" text`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clients_status" character varying(20) NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_status"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_notes"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_address"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_phone"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clients_company"`);
    }

}
