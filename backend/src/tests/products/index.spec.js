const request = require("supertest");
const app = require("../../app");
const knexC = require("knex");
const config = require("../../../knexfile");
const knex = knexC(config.test);

const email1 = "zeca@email.com";
const defaultPassword = "123456";

describe("GET /products", () => {
  let token;

  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();

    const loginResponse = await request(app).post("/sessions").send({
      email: email1,
      password: defaultPassword,
    });
    token = loginResponse.body.user.accessToken;

    await request(app)
      .post("/products")
      .send({
        name: "Pera",
        description: "Natural",
        quantity: 20,
        min_quantity: 10,
        price: 2.99,
        category: "Vegano",
        type: "Fruta",
      })
      .set("Authorization", `Bearer ${token}`);
  });

  it("should return 200 OK and have products property", async () => {
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("products");
  });

  it("should return 200 OK and return one product property", async () => {
    const product = await knex("products").first();

    const response = await request(app)
      .get(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("product");
  });

  it("should not return products", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: "mario@email.com",
      password: defaultPassword,
    });
    const tokenMario = loginResponse.body.user.accessToken;

    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${tokenMario}`);

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(0);
  });

  it("should create a new product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Banana",
        description: "Natural",
        quantity: 20,
        min_quantity: 10,
        price: 2.99,
        category: "Vegano",
        type: "Fruta",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("product");
  });

  it("should not create a new product when missing a parameter", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        description: "Natural",
        quantity: 20,
        min_quantity: 10,
        price: 2.99,
        category: "Vegano",
        type: "Fruta",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).not.toHaveProperty("product");
  });
});
