import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from "yup";
import ProductInterface from "../entity/product.interface";

export default class ProductYupValidator implements ValidatorInterface<ProductInterface> {
  validate(entity: ProductInterface): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required("Id is required"),
          name: yup.string().required("Name is required"),
          price: yup
            .number()
            .positive("Price must be greater than zero")
            .required("Price is required")
            .typeError("Price is required"),
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
            price: entity.price,
          },
          {
            abortEarly: false,
          },
        );
    } catch (errors) {
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: "product",
          message: error,
        });
      });
    }
  }
}
