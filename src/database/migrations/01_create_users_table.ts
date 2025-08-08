import type { Knex } from "knex";
import { User } from "../../models/user-model";

const enums = {
  role: "users_role",
};

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(User.tableName, (table) => {
    table.bigIncrements("id").primary();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("name", 255).notNullable();
    table.date("tanggalLahir").nullable();
    table.boolean("sudahLulus").defaultTo(false);
    table.decimal("skorKeseluruhan", 5, 2).nullable();
    table.string("profile_picture", 500).nullable();
    table.string("profile_picture_original_name", 255).nullable();
    table.string("profile_picture_cloudinary_url", 500).nullable();
    table
      .enum("role", ["student", "admin"], {
        useNative: true,
        enumName: enums.role,
      })
      .defaultTo("student");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("deleted_at", { useTz: true }).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(User.tableName);

  for (const typeName of Object.values(enums)) {
    await knex.schema.raw(`DROP TYPE IF EXISTS "${typeName}"`);
  }
}
