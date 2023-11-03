/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("name").notNullable();
      tbl.string("email").notNullable();
      tbl.json("roles").nullable();
      tbl.string("password").notNullable();
      tbl.dateTime("deleted_at").nullable();
      tbl.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      tbl.dateTime("updated_at").nullable();
    })
    .then(function () {
      return knex.raw(`
        CREATE TRIGGER update_users_updated_at
        AFTER UPDATE ON users
        FOR EACH ROW
        BEGIN
          UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
