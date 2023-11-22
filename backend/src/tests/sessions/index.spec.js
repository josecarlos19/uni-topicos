const request = require("supertest");
const app = require("../../app");
const knexC = require("knex");
const config = require("../../../knexfile");
const knex = knexC(config.test);
const { faker } = require("@faker-js/faker");

describe("POST /sessions", () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });

  const emailUser1 = "zeca@email.com";
  const defaultPassword = "123456";

  it("should return 200 OK", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: emailUser1,
      password: defaultPassword,
    });

    expect(loginResponse.statusCode).toEqual(200);
  });

  it("should return 401 Unauthorized", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: emailUser1,
      password: "wrongPassword",
    });

    expect(loginResponse.statusCode).toEqual(401);
  });

  it("should return a bearer token", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: emailUser1,
      password: defaultPassword,
    });

    expect(loginResponse.body.user).toHaveProperty("accessToken");
  });
});

describe("POST /signup", () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });

  it("should return 200 when created a new user", async () => {
    const signupResponse = await request(app).post("/signup").send({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(signupResponse.statusCode).toEqual(200);
  });

  it("should return 400 Bad Request when missing name parameter", async () => {
    const signupResponse = await request(app).post("/signup").send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(signupResponse.statusCode).toEqual(400);
  });

  it("should return 400 Bad Request when missing email parameter", async () => {
    const signupResponse = await request(app).post("/signup").send({
      name: faker.person.firstName(),
      password: faker.internet.password(),
    });

    expect(signupResponse.statusCode).toEqual(400);
  });

  it("should return 400 Bad Request when missing password parameter", async () => {
    const signupResponse = await request(app).post("/signup").send({
      name: faker.person.firstName(),
      email: faker.internet.email(),
    });

    expect(signupResponse.statusCode).toEqual(400);
  });
});
