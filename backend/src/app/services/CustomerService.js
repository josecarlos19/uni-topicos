const knexC = require("knex");
const config = require("../../../knexfile");
const moment = require("moment");
const knex = knexC(config.development);

class CustomerService {
  async get(userId) {
    const result = await knex
      .select()
      .from("customers")
      .where({ user_id: userId })
      .andWhere({ deleted_at: null });

    if (!result) {
      return [];
    }

    return result.map((customer) => {
      return {
        ...customer,
        created_at: moment(customer.created_at).format("DD/MM/YYYY"),
      };
    });
  }

  async show(id, userId) {
    const result = await knex
      .select()
      .from("customers")
      .where({ id })
      .andWhere({ user_id: userId });
    return result;
  }

  async store(payload, userId) {
    const result = await knex
      .insert({ ...payload, user_id: userId })
      .into("customers");
    return result;
  }

  async update(id, payload) {
    const foundCustomer = await knex
      .select()
      .from("customers")
      .where({ id })
      .first();

    if (!foundCustomer) {
      throw new Error("Customer not found");
    }

    const result = await knex("customers").update(payload).where({ id });
    return result;
  }

  async delete(id) {
    const result = await knex("customers")
      .update({ deleted_at: new Date() })
      .where({ id });
    return result;
  }
}

module.exports = new CustomerService();
