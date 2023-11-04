const ProductService = require("../services/ProductService");

class ProductController {
  async get(req, res) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const userId = req.userId;
      const result = await ProductService.get(userId, page, limit);

      res.status(200).json({
        products: result.products,
        total: result.total,
        pages: result.pages,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const userId = req.userId;
      const result = await ProductService.show(userId, id);

      res.status(200).json({ product: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const {
        name,
        description,
        quantity,
        price,
        category,
        type,
        min_quantity,
      } = req.body;
      const userId = req.userId;

      const result = await ProductService.store(userId, {
        name,
        description,
        quantity,
        min_quantity,
        price,
        category,
        type,
      });

      res.status(200).json({ product: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, description, quantity, price, category, type, min_quantity } =
      req.body;
    try {
      const userId = req.userId;
      const result = await ProductService.update(userId, id, {
        name,
        description,
        quantity,
        price,
        category,
        min_quantity,
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
