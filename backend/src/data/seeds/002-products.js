/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("products")
    .del()
    .then(function () {
      return knex("products").insert([
        {
          name: "Maçã",
          description: "Vermelha e deliciosa",
          quantity: 0,
          price: 1.0,
          category: "Fruta",
          type: "Maçã Gala",
        },
        {
          name: "Laranja",
          description: "Suculenta e refrescante",
          quantity: 0,
          price: 3.5,
          category: "Fruta",
          type: "Laranja Navel",
        },
        {
          name: "Banana",
          description: "Amarela e nutritiva",
          quantity: 0,
          price: 2.5,
          category: "Fruta",
          type: "Banana Cavendish",
        },
      ]);
    });
};
