import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const input = {
  type: "a",
  name: "Product 1",
  price: 10,
};

describe("Integration test create product use case", () => {
  let sequelize: Sequelize;
  const productRepository = new ProductRepository();

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  it("should create a product type A", async () => {
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should create a product type B", async () => {
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute({
      ...input,
      type: "b",
    });

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price * 2,
    });
  });

  it("should thrown an error when name is missing", async () => {
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(
      productCreateUseCase.execute({
        ...input,
        name: "",
      }),
    ).rejects.toThrow("Name is required");
  });

  it("should thrown an error when price is missing", async () => {
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(
      productCreateUseCase.execute({
        ...input,
        price: -10,
      }),
    ).rejects.toThrow("Price must be greater than zero");
  });
});
