/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("stocks", (tbl) => {
      tbl.increments();
      tbl.string("sector").notNullable();
      tbl.string("hall").nullable();
      tbl.string("shelf").notNullable();
      tbl
        .integer("product_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("products");
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_stocks_updated_at
        AFTER UPDATE ON stocks
        FOR EACH ROW
        BEGIN
          UPDATE stocks SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("stocks");
};
