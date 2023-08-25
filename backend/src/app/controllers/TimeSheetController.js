const TimeSheetService = require("../services/TimeSheetService");

class TimeSheetController {
  async get(req, res) {
    const { id } = req.params;

    try {
      if (!id) {
        throw new Error("Missing id");
      }
      const result = await TimeSheetService.get(id);

      res.status(200).json({ timesheets: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    const { type } = req.body;
    const userId = req.userId;

    try {
      if (!userId) {
        throw new Error("Missing user data");
      }
      if (type !== "in" && type !== "out") {
        throw new Error("Invalid type");
      }

      const result = await TimeSheetService.store(userId, type);

      res.status(200).json({ timesheet: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TimeSheetController();
