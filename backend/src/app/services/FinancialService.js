const knexC = require("knex");
const config = require("../../../knexfile");
const OrderService = require("./OrderService");
const knex = knexC(config.development);

async function checkProductIsAvailableOrValidToBuy(products) {
  const productIds = products.map((product) => product.id);

  const productsInStock = await knex
    .select()
    .from("products")
    .whereIn("id", productIds);

  const areAllProductsAvailable = productIds.every((productId) =>
    productsInStock.some((product) => product.id === productId)
  );

  return {
    areAllProductsAvailable,
    productsInStock,
  };
}

async function checkProductIsAvailableOrValidToSell(products) {
  const productIds = products.map((product) => product.id);

  const productsInStock = await knex
    .select()
    .from("products")
    .whereIn("id", productIds);

  const areAllProductsAvailable = productIds.every((productId) => {
    const currentProductPayload = products.find(
      (product) => product.id === productId
    );

    const productInStock = productsInStock.find(
      (product) => product.id === productId
    );

    return (
      productInStock &&
      productInStock.quantity - currentProductPayload.quantity >= 0
    );
  });

  return {
    areAllProductsAvailable,
    productsInStock,
  };
}

class FinancialService {
  async buy(products, userId) {
    products.some((product) => {
      if (product.quantity <= 0 || product.price < 0 || !product.id) {
        throw new Error("Missing product information");
      }
    });

    const check = await checkProductIsAvailableOrValidToBuy(products);
    if (check.areAllProductsAvailable) {
      const orderPayload = {
        user_id: userId,
        type: "buy",
      };

      const result = await OrderService.store(
        orderPayload,
        products,
        check.productsInStock
      );

      return result;
    } else {
      throw new Error("Product not available");
    }
  }

  async sell(products, userId) {
    products.some((product) => {
      if (product.quantity <= 0 || !product.id) {
        throw new Error("Missing product information");
      }
    });

    const check = await checkProductIsAvailableOrValidToSell(products);
    if (check.areAllProductsAvailable) {
      const orderPayload = {
        user_id: userId,
        type: "sell",
      };

      const produtsWithPrice = products.map((product) => {
        const productFromStock = check.productsInStock.find(
          (productStock) => productStock.id === product.id
        );

        return {
          ...product,
          price: productFromStock.price,
        };
      });

      const result = await OrderService.store(
        orderPayload,
        produtsWithPrice,
        check.productsInStock
      );

      return result;
    } else {
      throw new Error("Product not available");
    }
  }

  async sellOld(productId, userId, quantity) {
    const foundProduct = await knex
      .select()
      .from("products")
      .where("id", productId)
      .first();

    if (!foundProduct) {
      throw new Error("Product not found");
    }

    if (foundProduct.quantity - quantity >= 0) {
      foundProduct.quantity -= Math.abs(quantity);

      await knex("products").update(foundProduct).where("id", foundProduct.id);

      await OrderService.store({
        product_id: foundProduct.id,
        user_id: userId,
        quantity: -quantity,
        price: foundProduct.price,
        type: "sell",
      });

      return `${foundProduct.name} was selled!`;
    } else {
      throw new Error(`There are only ${foundProduct.quantity} available`);
    }
  }

  async fiscal(orderId) {
    const orderHeader = await knex
      .select(
        "orders.id as codigo_ordem",
        "orders.type as tipo_ordem",
        "users.name as comprador"
      )
      .from("orders")
      .innerJoin("users", "users.id", "=", "orders.user_id")
      .where("orders.id", orderId)
      .first();

    if (!orderHeader) {
      throw new Error(`There are no order available for ${orderId}`);
    }

    const orderProducts = await knex
      .select(
        "products.name as produto",
        "orders_products.quantity as quantidade",
        "orders_products.price as preço"
      )
      .from("orders_products")
      .innerJoin("products", "products.id", "=", "orders_products.product_id")
      .where("order_id", orderId);

    orderHeader.total_ordem = orderProducts.reduce(
      (sum, product) => sum + product.preço * product.quantidade,
      0
    );

    if (orderHeader.tipo_ordem === "buy") {
      orderHeader.tipo_ordem = "Compra";
    } else if (orderHeader.tipo_ordem === "sell") {
      orderHeader.tipo_ordem = "Venda";
    }

    return {
      cabeçalho_da_ordem: orderHeader,
      produtos_da_ordem: orderProducts,
    };
  }

  async getOrderReport(type, userId = null) {
    let result = null;
    if (userId) {
      result = await knex
        .select(
          "orders.id as codigo_ordem",
          "orders.type as tipo_ordem",
          "users.name as comprador"
        )
        .from("orders")
        .innerJoin("users", "users.id", "=", "orders.user_id")
        .where("orders.type", type)
        .where("users.id", userId);
    } else {
      result = await knex
        .select(
          "orders.id as codigo_ordem",
          "orders.type as tipo_ordem",
          "users.name as comprador"
        )
        .from("orders")
        .innerJoin("users", "users.id", "=", "orders.user_id")
        .where("orders.type", type);
    }

    result = result.map((order) => {
      return {
        ...order,
        tipo_ordem: order.tipo_ordem === "buy" ? "compra" : "venda",
      };
    });

    return result;
  }

  async buyReport(userId = null) {
    const result = await this.getOrderReport("buy", userId);

    return result;
  }

  async sellReport(userId = null) {
    const result = await this.getOrderReport("sell", userId);

    return result;
  }
}

module.exports = new FinancialService();
