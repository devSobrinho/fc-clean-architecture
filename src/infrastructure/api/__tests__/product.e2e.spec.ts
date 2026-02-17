import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 100,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(100);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "john",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 100,
    });
    expect(response.status).toBe(200);
    const response2 = await request(app).post("/product").send({
      type: "b",
      name: "Product 2",
      price: 200,
    });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(400);
  });

  it("should not list all product", async () => {
    const response = await request(app).get("/product").send();
    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(0);
  });

  it("should find a product by id", async () => {
    const responseCreated = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 100,
    });

    const response = await request(app)
      .get(`/product/${responseCreated.body.id}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(responseCreated.body.id);
    expect(response.body.name).toBe(responseCreated.body.name);
    expect(response.body.price).toBe(responseCreated.body.price);
  });

  it("should not find a product by id", async () => {
    const response = await request(app).get("/product/invalid-id").send();
    expect(response.status).toBe(500);
  });

  it("should update a product", async () => {
    const responseCreated = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 100,
    });

    const response = await request(app)
      .put(`/product/${responseCreated.body.id}`)
      .send({
        name: "Product 1 Updated",
        price: 200,
      });
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(responseCreated.body.id);
    expect(response.body.name).toBe("Product 1 Updated");
    expect(response.body.price).toBe(200);
  });

  it("should not update a product", async () => {
    const response = await request(app).put("/product/invalid-id").send({
      name: "Product 1 Updated",
      price: 200,
    });
    expect(response.status).toBe(500);
  });
});
