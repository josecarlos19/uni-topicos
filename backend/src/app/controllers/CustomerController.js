const CustomerService = require("../services/CustomerService");

class CustomerController {
  async get(req, res) {
    try {
      const result = await CustomerService.get();

      res.status(200).json({ customers: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const result = await CustomerService.show(id);

      res.status(200).json({ customer: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    const { name, email } = req.body;
    const userId = req.userId;

    try {
      if (!name || !email) {
        throw new Error("Missing customer information");
      }
      const result = await CustomerService.store(req.body, userId);

      res.status(201).json({ customer: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
      if (!name || !email) {
        throw new Error("Missing customer information");
      }
      const result = await CustomerService.update(id, req.body);

      res.status(201).json({ customer: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      if (!id) {
        throw new Error("Missing customer id");
      }
      const result = await CustomerService.delete(id);

      res.status(201).json({ customer: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new CustomerController();
