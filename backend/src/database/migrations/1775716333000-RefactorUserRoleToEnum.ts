import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorUserRoleToEnum1775716333000 implements MigrationInterface {
    name = 'RefactorUserRoleToEnum1775716333000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create the native ENUM type
        await queryRunner.query(`CREATE TYPE "users_users_role_enum" AS ENUM('super_admin', 'admin', 'member')`);

        // 2. Drop the default value first (SQL requirement when changing to ENUM)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" DROP DEFAULT`);

        // 3. Alter the column type using casting
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" TYPE "users_users_role_enum" USING ("users_role"::"users_users_role_enum")`);

        // 4. Set the default value back for the new type
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" SET DEFAULT 'member'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Remove the default value
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" DROP DEFAULT`);

        // 2. Revert column type to character varying
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" TYPE character varying`);

        // 3. Drop the native ENUM type
        await queryRunner.query(`DROP TYPE "users_users_role_enum"`);
    }

}
