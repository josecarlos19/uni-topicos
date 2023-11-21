// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./devDb.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: "./testDb.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/data/migrations",
    },
    seeds: {
      directory: "./src/data/seeds",
    },
  },
};
