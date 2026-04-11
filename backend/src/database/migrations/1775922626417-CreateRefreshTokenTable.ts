import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshTokenTable1775922626417 implements MigrationInterface {
    name = 'CreateRefreshTokenTable1775922626417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("rt_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rt_token" character varying NOT NULL, "rt_user_id" uuid NOT NULL, "rt_expires_at" TIMESTAMP NOT NULL, "rt_is_revoked" boolean NOT NULL DEFAULT false, "rt_created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c80e82c05f574859bda6160ec47" UNIQUE ("rt_token"), CONSTRAINT "PK_57e3e73a384c2a05477b111e2f4" PRIMARY KEY ("rt_id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_eada9e71074648a39b61ce51f74" FOREIGN KEY ("rt_user_id") REFERENCES "users"("users_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_eada9e71074648a39b61ce51f74"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
