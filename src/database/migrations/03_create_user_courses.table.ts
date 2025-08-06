import type { Knex } from 'knex';
import { User } from '../../models/user-model';
import { Course } from '../../models/course-model';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_courses', table => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').notNullable().references('id').inTable(User.tableName).onDelete('CASCADE');
    table.bigInteger('course_id').notNullable().references('id').inTable(Course.tableName).onDelete('CASCADE');
    table.timestamp('enrolled_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_courses');
}
