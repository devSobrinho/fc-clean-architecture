import Entity from "../../@shared/entity/entity.abstract";

export default interface ProductInterface extends Entity {
  get name(): string;
  get price(): number;

  changeName(name: string): void;
  changePrice(price: number): void;
  validate(): void;
}
