/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  const hashedPassword = await bcrypt.hash("123456", 8);
  await knex("users").del();
  await knex("users").insert([
    { id: 1, name: "Zeca", email: "zeca@email.com", password: hashedPassword },
    {
      id: 2,
      name: "Mario",
      email: "mario@email.com",
      password: hashedPassword,
    },
    { id: 3, name: "Luiz", email: "luiz@email.com", password: hashedPassword },
    {
      id: 4,
      name: "Admin",
      email: "admin@admin.com",
      roles: JSON.stringify(["admin"]),
      password: hashedPassword,
    },
  ]);
};
