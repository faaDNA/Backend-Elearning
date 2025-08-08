import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("books", (table) => {
    table.bigIncrements("id").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("author").notNullable();
    table.string("isbn").nullable();
    table.string("category").notNullable();
    table.decimal("price", 12, 2).notNullable();
    table.string("image").nullable();
    table.integer("stock").defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("deleted_at", { useTz: true }).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("books");
}
