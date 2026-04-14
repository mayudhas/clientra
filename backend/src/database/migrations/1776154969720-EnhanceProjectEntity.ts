import { MigrationInterface, QueryRunner } from "typeorm";

export class EnhanceProjectEntity1776154969720 implements MigrationInterface {
    name = 'EnhanceProjectEntity1776154969720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "projects_description" text`);
        await queryRunner.query(`CREATE TYPE "public"."projects_projects_status_enum" AS ENUM('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "projects_status" "public"."projects_projects_status_enum" NOT NULL DEFAULT 'planning'`);
        await queryRunner.query(`CREATE TYPE "public"."projects_projects_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "projects_priority" "public"."projects_projects_priority_enum" NOT NULL DEFAULT 'medium'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "projects_budget" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "projects_start_date" date`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "projects_end_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projects_end_date"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projects_start_date"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projects_budget"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projects_priority"`);
        await queryRunner.query(`DROP TYPE "public"."projects_projects_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projects_status"`);
        await queryRunner.query(`DROP TYPE "public"."projects_projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "projects_description"`);
    }

}
