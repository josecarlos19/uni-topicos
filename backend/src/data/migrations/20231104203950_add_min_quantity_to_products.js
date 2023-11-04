/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("products", (table) => {
    table.integer("min_quantity").notNullable().defaultTo(10);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("products", (table) => {
    table.dropColumn("min_quantity");
  });
};
