const EmployeesService = require("../services/EmployeesService");

class EmployeesController {
  async get(req, res) {
    try {
      const result = await EmployeesService.get();

      res.status(201).json({ employees: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const result = await EmployeesService.show(id);

      res.status(201).json({ employee: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { user_id, office, salary, workload, sector } = req.body;

      const result = await EmployeesService.store({
        user_id,
        office,
        salary,
        workload,
        sector,
      });

      res.status(201).json({ employee: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    try {
      const { user_id, office, salary, workload, sector } = req.body;

      const result = await EmployeesService.update(id, {
        user_id,
        office,
        salary,
        workload,
        sector,
      });

      res.status(201).json({ employee: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new EmployeesController();
