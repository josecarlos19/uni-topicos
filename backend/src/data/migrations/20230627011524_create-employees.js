/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("employees", (tbl) => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("users");
      tbl.string("office").notNullable();
      tbl.string("salary").notNullable();
      tbl.string("workload").notNullable();
      tbl.string("sector").notNullable();
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_employees_updated_at
        AFTER UPDATE ON employees
        FOR EACH ROW
        BEGIN
          UPDATE employees SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("employees");
};
