const ProductService = require("../services/ProductService");

class ProductController {
  async get(req, res) {
    try {
      const userId = req.userId;
      const result = await ProductService.get(userId);

      res.status(200).json({ products: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const userId = req.userId;
      const result = await ProductService.show(userId, id);

      res.status(200).json({ products: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { name, description, quantity, price, category, type } = req.body;

      const result = await ProductService.store(req.userId, {
        name,
        description,
        quantity,
        price,
        category,
        type,
      });

      res.status(200).json({ product: result });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, description, quantity, price, category, type } = req.body;
    try {
      const userId = req.userId;
      const result = await ProductService.update(userId, id, {
        name,
        description,
        quantity,
        price,
        category,
        type,
      });

      res.status(200).json({ product: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const userId = req.userId;
      const result = await ProductService.delete(userId, id);

      res.status(200).json({ message: "Deleted", product: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
