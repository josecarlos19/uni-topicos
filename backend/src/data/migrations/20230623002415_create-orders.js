/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("orders", (tbl) => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("users");
      tbl.enu("type", ["buy", "sell"]).notNullable().defaultTo("buy");
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_orders_updated_at
        AFTER UPDATE ON orders
        FOR EACH ROW
        BEGIN
          UPDATE orders SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("orders");
};
