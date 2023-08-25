const knexC = require("knex");
const config = require("../../../knexfile");
const FinancialService = require("./FinancialService");
const knex = knexC(config.development);

class ProductService {
  async get() {
    const products = await knex.select().from("products");

    return products;
  }

  async show(productId) {
    const product = await knex
      .select()
      .from("products")
      .where("id", productId)
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
      !payload.type
    ) {
      throw new Error("Missing data to create a product");
    }

    const [createdProduct] = await knex("products")
      .insert(payload)
      .returning(["id", "quantity", "price"]);

    await FinancialService.buy(
      createdProduct.id,
      userId,
      createdProduct.quantity,
      createdProduct.price
    );

    return createdProduct;
  }

  async update(productId, payload) {
    const product = await knex
      .select()
      .from("products")
      .where("id", productId)
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

  async delete(productId) {
    const product = await knex
      .select()
      .from("products")
      .where("id", productId)
      .first();

    if (!product) {
      throw new Error("Product not found");
    }

    await knex("products").where("id", productId).del();

    return productId;
  }
}

module.exports = new ProductService();
