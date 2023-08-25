const FinancialService = require("../services/FinancialService");

class FinancialController {
  async buy(req, res) {
    const { products } = req.body;
    try {
      if (products.length <= 0) {
        throw new Error("Missing products to do an order");
      }
      const result = await FinancialService.buy(products, req.userId);

      res.status(201).json({ order: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async sell(req, res) {
    const { products } = req.body;
    try {
      if (products.length <= 0) {
        throw new Error("Missing products to do an order");
      }
      const result = await FinancialService.sell(products, req.userId);

      res.status(201).json({ order: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async fiscal(req, res) {
    const { id } = req.params;

    try {
      if (!id) {
        throw new Error("Missing id to find an order");
      }
      const result = await FinancialService.fiscal(id);

      res.status(201).json({ order: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async buyReport(req, res) {
    try {
      const result = await FinancialService.buyReport();

      res.status(201).json({ records: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async userBuyReport(req, res) {
    const { id } = req.params;
    try {
      const result = await FinancialService.buyReport(id);

      res.status(201).json({ records: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async sellReport(req, res) {
    const { id } = req.params;
    try {
      const result = await FinancialService.sellReport(id);

      res.status(201).json({ records: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async userSellReport(req, res) {
    try {
      const result = await FinancialService.sellReport(req.userId);

      res.status(201).json({ records: result });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new FinancialController();
