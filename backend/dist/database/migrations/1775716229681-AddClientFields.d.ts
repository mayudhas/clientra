import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddClientFields1775716229681 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
