const knexC = require("knex");
const config = require("../../../knexfile");
const moment = require("moment");
const knex = knexC(config.development);

class CustomerService {
  async get() {
    const result = await knex.select().from("customers");
    return result.map((customer) => {
      return {
        ...customer,
        created_at: moment(customer.created_at).format("DD/MM/YYYY"),
      };
    });
  }

  async show(id) {
    const result = await knex.select().from("customers").where({ id });
    return result;
  }

  async store(payload) {
    const result = await knex.insert(payload).into("customers");
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
    const result = await knex("customers").where({ id }).del();
    return result;
  }
}

module.exports = new CustomerService();
