const knexC = require("knex");
const config = require("../../../knexfile");
const env = process.env.NODE_ENV || "development";
const knex = knexC(config[env]);
const bcrypt = require("bcryptjs");

class UserService {
  async get() {
    const users = await knex
      .select("id", "name", "email", "roles")
      .from("users");
    return users;
  }

  async show(id) {
    const user = await knex
      .select("id", "name", "email")
      .from("users")
      .where("id", id)
      .first();
    return user;
  }

  async store(payload) {
    if (!payload.name || !payload.email || !payload.password) {
      throw new Error("Missing data to create an user");
    }

    const foundUser = await knex
      .select()
      .from("users")
      .where("email", payload.email)
      .first();

    if (foundUser) {
      throw new Error("Email in use");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 8);

    const [createdUser] = await knex("users")
      .insert({
        ...payload,
        password: hashedPassword,
      })
      .returning(["id", "name", "email"]);

    return createdUser;
  }

  async update(id, payload) {
    const user = await knex.select().from("users").where("id", id).first();

    if (!user) {
      throw new Error("User not found");
    }

    if (payload.email) {
      const foundUser = await knex
        .select()
        .from("users")
        .where("email", payload.email)
        .first();

      if (foundUser && foundUser.id !== id) {
        throw new Error("Email in use");
      }
    }

    const [updatedUser] = await knex("users")
      .where("id", id)
      .update(payload)
      .returning(["id", "name", "email"]);

    return updatedUser;
  }

  async delete(id) {
    const user = await knex.select().from("users").where("id", id).first();

    if (!user) {
      throw new Error("User not found");
    }

    await knex("users").update("deleted_at", new Date()).where("id", id);
  }
}

module.exports = new UserService();
