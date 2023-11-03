/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("products")
    .del()
    .then(function () {
      return knex("customers").insert([
        {
          name: "Lucas",
          user_id: 1,
          email: "lucas@email.com",
        },
      ]);
    });
};
