import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSyncV21775698176051 implements MigrationInterface {
    name = 'SchemaSyncV21775698176051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("projects_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projects_name" character varying NOT NULL, "projects_progress" integer NOT NULL DEFAULT '0', "projects_client_id" uuid NOT NULL, "projects_tenant_id" uuid NOT NULL, "projects_created_at" TIMESTAMP NOT NULL DEFAULT now(), "projects_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4e29ca4bca219d2829f5a655255" PRIMARY KEY ("projects_id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("invoices_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoices_amount" integer NOT NULL, "invoices_status" character varying NOT NULL, "invoices_client_id" uuid NOT NULL, "invoices_tenant_id" uuid NOT NULL, "invoices_created_at" TIMESTAMP NOT NULL DEFAULT now(), "invoices_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5faaede3365b432c535c4c36018" PRIMARY KEY ("invoices_id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("clients_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clients_name" character varying NOT NULL, "clients_email" character varying, "clients_tenant_id" uuid NOT NULL, "clients_created_at" TIMESTAMP NOT NULL DEFAULT now(), "clients_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64569f204111d06b70d47fa163c" PRIMARY KEY ("clients_id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("tenants_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenants_name" character varying NOT NULL, "tenants_created_at" TIMESTAMP NOT NULL DEFAULT now(), "tenants_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c9ed7ace553c99c97f94ce296d" PRIMARY KEY ("tenants_id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_bf37f721367dad55e75b5730b08" PRIMARY KEY ("users_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe62a84d8ea7e438d0f322c0815" UNIQUE ("users_email")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_role" character varying NOT NULL DEFAULT 'member'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_tenant_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "users_updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_25117062fb8fe5ce9afcf90b7ab" FOREIGN KEY ("projects_client_id") REFERENCES "clients"("clients_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_190fc11c8fad8d04ffc9d30352e" FOREIGN KEY ("projects_tenant_id") REFERENCES "tenants"("tenants_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_13aec10a1e1ffb40d5004f3ff1e" FOREIGN KEY ("invoices_client_id") REFERENCES "clients"("clients_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_832c27c33e0d95fcd83a2234a15" FOREIGN KEY ("invoices_tenant_id") REFERENCES "tenants"("tenants_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_54d5d71a9904a75b0e7e9841b2d" FOREIGN KEY ("clients_tenant_id") REFERENCES "tenants"("tenants_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_04bd23499ce6855f3ff671d3e06" FOREIGN KEY ("users_tenant_id") REFERENCES "tenants"("tenants_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_04bd23499ce6855f3ff671d3e06"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_54d5d71a9904a75b0e7e9841b2d"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_832c27c33e0d95fcd83a2234a15"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_13aec10a1e1ffb40d5004f3ff1e"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_190fc11c8fad8d04ffc9d30352e"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_25117062fb8fe5ce9afcf90b7ab"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe62a84d8ea7e438d0f322c0815"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_bf37f721367dad55e75b5730b08"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "users_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
