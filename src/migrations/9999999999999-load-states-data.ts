import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class LoadStatesData9999999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('state');

    if (!tableExists) {
      console.log('Table "state" does not exist. Skipping data load.');
      return;
    }

    const statesData = JSON.parse(
      fs.readFileSync('src/migrations/data-only/states.json', 'utf8'),
    );

    for (const state of statesData) {
      await queryRunner.query(`
                INSERT INTO "state" ("name", "abbreviation") VALUES
                ('${state.name}', '${state.abbreviation}')
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "state"`);
  }
}
