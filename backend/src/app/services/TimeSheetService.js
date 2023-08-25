const knexC = require("knex");
const config = require("../../../knexfile");
const OrderService = require("./OrderService");
const moment = require("moment/moment");
const knex = knexC(config.development);

class TimeSheetService {
  async store(userId, type) {
    const employee = await knex("employees")
      .select("user_id", "id")
      .where("user_id", userId)
      .first();

    if (!employee) {
      throw new Error("Employee not found");
    }

    const now = moment();

    const existingEntry = await knex("timesheets")
      .select()
      .where("employee_id", employee.id)
      .andWhere("type", type)
      .andWhere("created_at", "<=", now)
      .first();

    if (existingEntry) {
      throw new Error("Action already exists");
    }

    const timeSheet = await knex("timesheets")
      .insert({
        employee_id: employee.id,
        type,
      })
      .returning("*");
    return timeSheet;
  }

  async get(employeeId) {
    const timeSheets = await knex("timesheets")
      .select()
      .where("employee_id", employeeId);

    const groupedTimesheets = timeSheets.reduce((result, timesheet) => {
      const date = moment(timesheet.created_at).format("DD/MM/YYYY");
      const existingEntry = result.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.action.push({
          type: timesheet.type,
          created: timesheet.created_at,
        });
      } else {
        result.push({
          date,
          action: [
            {
              type: timesheet.type,
              created: timesheet.created_at,
            },
          ],
        });
      }

      return result;
    }, []);

    return groupedTimesheets;
  }
}

module.exports = new TimeSheetService();
