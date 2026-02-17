import CreateProductUseCase from "./create.product.usecase";

const input = {
  type: "a",
  name: "Product 1",
  price: 10,
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product type A", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should create a product type B", async () => {
    const productRepository = MockRepository();
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
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(
      productCreateUseCase.execute({
        ...input,
        name: "",
      }),
    ).rejects.toThrow("Name is required");
  });

  it("should thrown an error when price is missing", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    await expect(
      productCreateUseCase.execute({
        ...input,
        price: -10,
      }),
    ).rejects.toThrow("Price must be greater than zero");
  });
});
