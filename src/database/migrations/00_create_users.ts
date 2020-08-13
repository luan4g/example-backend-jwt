import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.integer("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table
      .timestamp("created_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"))
      .notNullable();
    table.string("passwordResetToken");
    table.date("passwordResetExpires");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
