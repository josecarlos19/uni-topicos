/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("products", (tbl) => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("users")
        .notNullable();
      tbl.string("name").notNullable();
      tbl.string("description").nullable();
      tbl.integer("quantity").notNullable();
      tbl.float("price", 2).notNullable();
      tbl.string("category").notNullable();
      tbl.string("type").nullable();
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_products_updated_at
        AFTER UPDATE ON products
        FOR EACH ROW
        BEGIN
          UPDATE products SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
