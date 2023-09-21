/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("customers", (tbl) => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("users")
        .notNullable();
      tbl.string("name").notNullable();
      tbl.string("email").notNullable();
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_customers_updated_at
        AFTER UPDATE ON customers
        FOR EACH ROW
        BEGIN
          UPDATE customers SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("customers");
};
