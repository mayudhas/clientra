import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePasswordResets1775920799040 implements MigrationInterface {
    name = 'CreatePasswordResets1775920799040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_resets" ("pr_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pr_email" character varying NOT NULL, "pr_token" character varying NOT NULL, "pr_expires_at" TIMESTAMP NOT NULL, "pr_created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f333851676056c1068531a08e41" PRIMARY KEY ("pr_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c3438df05641e199a39c87b4ac" ON "password_resets" ("pr_email", "pr_token") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c3438df05641e199a39c87b4ac"`);
        await queryRunner.query(`DROP TABLE "password_resets"`);
    }

}
