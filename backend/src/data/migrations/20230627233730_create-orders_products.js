/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("orders_products", (tbl) => {
      tbl.increments();
      tbl
        .integer("order_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("orders");
      tbl
        .integer("product_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("products");
      tbl.integer("quantity").notNullable();
      tbl.float("price", 2).notNullable();
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_orders_products_updated_at
        AFTER UPDATE ON orders_products
        FOR EACH ROW
        BEGIN
          UPDATE orders_products SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("orders_products");
};
