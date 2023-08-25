const UserService = require("../services/UserService");

class UserController {
  async get(req, res) {
    try {
      const result = await UserService.get();

      res.status(200).json({ users: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const result = await UserService.show(id);

      res.status(200).json({ user: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, email, password } = req.body;

      const result = await UserService.store({ name, email, password });

      res.status(200).json({ user: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error("Missing id");
      }

      const { name, email, password } = req.body;

      const result = await UserService.update(id, {
        name,
        email,
        password,
      });

      res.status(200).json({ user: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await UserService.delete(id);

      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
module.exports = new UserController();
