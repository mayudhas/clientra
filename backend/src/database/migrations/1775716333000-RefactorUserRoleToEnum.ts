import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorUserRoleToEnum1775716333000 implements MigrationInterface {
    name = 'RefactorUserRoleToEnum1775716333000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create the native ENUM type
        await queryRunner.query(`CREATE TYPE "users_users_role_enum" AS ENUM('super_admin', 'admin', 'member')`);

        // 2. Alter the column type using casting
        // We use the existing values and cast them to the new enum type
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "users_role" TYPE "users_users_role_enum" USING ("users_role"::"users_users_role_enum")`);

        // 3. Set the default value for the new type
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
