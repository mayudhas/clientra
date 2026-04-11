import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToUser1775919447102 implements MigrationInterface {
    name = 'AddIsActiveToUser1775919447102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "users_is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_is_active"`);
    }

}
