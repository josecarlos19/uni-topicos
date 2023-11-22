const knexC = require("knex");
const config = require("../../../knexfile");
const FinancialService = require("./FinancialService");
const env = process.env.NODE_ENV || "development";
const knex = knexC(config[env]);

class ProductService {
  async get(userId, page = 1, limit = 10) {
    let products = await knex
      .select()
      .from("products")
      .where("user_id", userId)
      .andWhere("deleted_at", null)
      .limit(limit)
      .offset((page - 1) * limit);

    products = products.map((product) => {
      return {
        ...product,
        price: Number(product.price).toFixed(2),
      };
    });

    const total = await knex("products")
      .where("user_id", userId)
      .andWhere("deleted_at", null)
      .count();

    return {
      products,
      total: total[0]["count(*)"],
      pages: Math.ceil(total[0].count / limit),
    };
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
      !payload.min_quantity ||
      !payload.type ||
      !userId
    ) {
      throw new Error("Missing data to create a product");
    }

    const createdProduct = await knex("products")
      .insert({ ...payload, user_id: userId })
      .returning(["id", "quantity", "price"]);

    await FinancialService.buy(createdProduct, null, userId);

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

    await knex("products")
      .update("deleted_at", new Date())
      .where("id", productId);

    return productId;
  }
}

module.exports = new ProductService();
