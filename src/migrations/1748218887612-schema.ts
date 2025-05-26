import { MigrationInterface, QueryRunner } from "typeorm";

export class Schema1748218887612 implements MigrationInterface {
    name = 'Schema1748218887612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "producer" ("id" SERIAL NOT NULL, "cpfCnpj" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_416a6709f5bdb2dd4f6ffd6f4fb" UNIQUE ("cpfCnpj"), CONSTRAINT "PK_4cfe496c2c70e4c9b9f444525a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "season" ("id" SERIAL NOT NULL, "year" character varying(20) NOT NULL, "plantingsId" integer, CONSTRAINT "UQ_676a565d671bac5e2883a225aa3" UNIQUE ("year"), CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crop" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_3b0092fe001d72938594cb32bd2" UNIQUE ("name"), CONSTRAINT "PK_f306910b05e2d54ed972a536a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "planting" ("id" SERIAL NOT NULL, "farm_id" integer, "season_id" integer, "crop_id" integer, CONSTRAINT "PK_4e01c180f7c369f52f01d6d8640" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farm" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "totalArea" numeric(15,2) NOT NULL, "cultivableArea" numeric(15,2) NOT NULL, "vegetationArea" numeric(15,2) NOT NULL, "producer_id" integer, "city_id" integer, "planting_id" integer, CONSTRAINT "UQ_11527b5b142bb3e07f87d459802" UNIQUE ("name"), CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "state_id" integer, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "abbreviation" character varying(2) NOT NULL, CONSTRAINT "UQ_b2c4aef5929860729007ac32f6f" UNIQUE ("name"), CONSTRAINT "UQ_a4925b2350673eb963998d27ec3" UNIQUE ("abbreviation"), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "season" ADD CONSTRAINT "FK_b9279bed5d788c9287f6a7b0e3a" FOREIGN KEY ("plantingsId") REFERENCES "planting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "planting" ADD CONSTRAINT "FK_21bf320184c1d690cf118f3240f" FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "planting" ADD CONSTRAINT "FK_71326d9dac0af0bfeb9f628dd50" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "planting" ADD CONSTRAINT "FK_fc89edeb27dcc9b3a11854fa06f" FOREIGN KEY ("crop_id") REFERENCES "crop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_880922928ea14316a36e5769fc7" FOREIGN KEY ("producer_id") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_5cba10c77d77b1fea761a5ea985" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_088e6e7e19f8e41b61bc7b0d217" FOREIGN KEY ("planting_id") REFERENCES "planting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_37ecd8addf395545dcb0242a593" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_37ecd8addf395545dcb0242a593"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_088e6e7e19f8e41b61bc7b0d217"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_5cba10c77d77b1fea761a5ea985"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_880922928ea14316a36e5769fc7"`);
        await queryRunner.query(`ALTER TABLE "planting" DROP CONSTRAINT "FK_fc89edeb27dcc9b3a11854fa06f"`);
        await queryRunner.query(`ALTER TABLE "planting" DROP CONSTRAINT "FK_71326d9dac0af0bfeb9f628dd50"`);
        await queryRunner.query(`ALTER TABLE "planting" DROP CONSTRAINT "FK_21bf320184c1d690cf118f3240f"`);
        await queryRunner.query(`ALTER TABLE "season" DROP CONSTRAINT "FK_b9279bed5d788c9287f6a7b0e3a"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "farm"`);
        await queryRunner.query(`DROP TABLE "planting"`);
        await queryRunner.query(`DROP TABLE "crop"`);
        await queryRunner.query(`DROP TABLE "season"`);
        await queryRunner.query(`DROP TABLE "producer"`);
    }

}
