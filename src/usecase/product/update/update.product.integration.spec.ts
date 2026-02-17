import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const product = ProductFactory.create("a", "Product 1", 50);

const input = {
  id: product.id,
  name: "Product 1 Updated",
  price: 100,
};

describe("Integration test for product update use case", () => {
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

    await productRepository.create(product);
  });

  it("should update a product", async () => {
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when product not found", async () => {
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    await expect(
      productUpdateUseCase.execute({
        ...input,
        id: "123",
      }),
    ).rejects.toThrow("Product not found");
  });
});
