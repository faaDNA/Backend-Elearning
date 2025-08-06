import type { Knex } from 'knex';
import { Course } from '../../models/course-model';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(Course.tableName, table => {
    table.bigIncrements('id').primary();
    table.string('title').notNullable();
    table.string('slug').notNullable();
    table.text('description').notNullable();
    table.text('image').notNullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: true }).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(Course.tableName);
}
