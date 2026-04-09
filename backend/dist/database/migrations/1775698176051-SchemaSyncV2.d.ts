import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SchemaSyncV21775698176051 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
