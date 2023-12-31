const knexC = require("knex");
const config = require("../../../knexfile");
const env = process.env.NODE_ENV || "development";
const knex = knexC(config[env]);

class OrderService {
  async store(orderPayload, products, productsInStock) {
    const createdOrderProductsList = [];

    const [createdOrder] = await knex("orders")
      .insert(orderPayload)
      .returning("*");

    for (let product of products) {
      const foundProduct = productsInStock.find(
        (productInStock) => productInStock.id === product.id
      );

      const absoluteQuantity = Math.abs(product.quantity);

      if (orderPayload.type === "buy") {
        foundProduct.quantity += absoluteQuantity;
      } else if (orderPayload.type === "sell") {
        foundProduct.quantity -= absoluteQuantity;
      } else {
        throw new Error("Unknown order type");
      }

      await knex("products")
        .update({ quantity: foundProduct.quantity })
        .where("id", foundProduct.id);

      const [createdOrderProducts] = await knex("orders_products")
        .insert({
          order_id: createdOrder.id,
          product_id: product.id,
          quantity: absoluteQuantity,
          price: product.price,
        })
        .returning("*");

      createdOrderProductsList.push(createdOrderProducts);
    }

    const totalOrderPrice = createdOrderProductsList.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);

    const result = {
      order: { ...createdOrder, price: totalOrderPrice },
      products: createdOrderProductsList,
    };

    return result;
  }

  async cancel(id) {
    const [order] = await knex("orders").where("id", id).returning("*");

    if (!order) {
      throw new Error("Order not found");
    }

    const products = await knex("orders_products")
      .where("order_id", id)
      .returning("*");

    for (let product of products) {
      const [productInStock] = await knex("products")
        .where("id", product.product_id)
        .returning("*");
      productInStock.quantity += product.quantity;
      await knex("products")
        .update({ quantity: productInStock.quantity })
        .where("id", product.product_id);
    }

    const result = await knex("orders")
      .update({ deleted_at: new Date() })
      .where("id", id)
      .returning("*");

    return result;
  }
}

module.exports = new OrderService();
