const knexC = require("knex");
const config = require("../../../knexfile");
const FinancialService = require("./FinancialService");
const knex = knexC(config.development);

class ProductService {
  async get(userId) {
    const products = await knex
      .select()
      .from("products")
      .where("user_id", userId);

    return products;
  }

  async show(userId, productId) {
    const product = await knex
      .select()
      .from("products")
      .where("id", productId)
      .andWhere("user_id", userId)
      .first();

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async store(userId, payload) {
    if (
      !payload.name ||
      !payload.description ||
      !payload.quantity ||
      !payload.price ||
      !payload.category ||
      !payload.type ||
      !userId
    ) {
      throw new Error("Missing data to create a product");
    }

    const createdProduct = await knex("products")
      .insert({ ...payload, user_id: userId })
      .returning(["id", "quantity", "price"]);

    await FinancialService.buy(createdProduct, userId);

    return createdProduct;
  }

  async update(userId, productId, payload) {
    const product = await knex
      .select()
      .from("products")
      .where("id", productId)
      .andWhere("user_id", userId)
      .first();

    if (!product) {
      throw new Error("Product not found");
    }

    const result = await knex("products")
      .update(payload)
      .where("id", product.id)
      .returning("*");

    return result;
  }

  async delete(userId, productId) {
    const product = await knex
      .select()
      .from("products")
      .where("id", productId)
      .andWhere("user_id", userId)
      .first();

    if (!product) {
      throw new Error("Product not found");
    }

    await knex("products").where("id", productId).del();

    return productId;
  }
}

module.exports = new ProductService();
