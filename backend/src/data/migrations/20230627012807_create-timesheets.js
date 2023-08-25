/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("timesheets", (tbl) => {
      tbl.increments();
      tbl
        .string("employee_id")
        .unsigned()
        .index()
        .references("id")
        .inTable("employees");
      tbl.enu("type", ["in", "out"]).notNullable().defaultTo("in");
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_timesheets_updated_at
        AFTER UPDATE ON timesheets
        FOR EACH ROW
        BEGIN
          UPDATE timesheets SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("timesheets");
};
