const knexC = require("knex");
const config = require("../../../knexfile");
const OrderService = require("./OrderService");
const knex = knexC(config.development);

class EmployeesService {
  async store(payload) {
    if (
      !payload.user_id ||
      !payload.office ||
      !payload.salary ||
      !payload.workload ||
      !payload.sector
    ) {
      throw new Error("Missing data to create an employee");
    }

    const [createdEmployee] = await knex("employees")
      .insert(payload)
      .returning("*");

    return createdEmployee;
  }

  async get() {
    const employees = await knex("employees")
      .select("employees.*", "users.name as user_name")
      .innerJoin("users", "users.id", "=", "employees.user_id");
    return employees;
  }

  async show(employeeId) {
    const employee = await knex("employees")
      .select("employees.*", "users.name as user_name")
      .innerJoin("users", "users.id", "=", "employees.user_id")
      .where("employees.id", employeeId)
      .first();

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  async update(employeeId, payload) {
    const employee = await knex("employees")
      .select("id")
      .where("employees.id", employeeId)
      .first();

    if (!employee) {
      throw new Error("Employee not found");
    }

    const updatedEmployee = await await knex("employees")
      .update(payload)
      .where("id", employeeId)
      .returning("*");

    return employee;
  }
}

module.exports = new EmployeesService();
