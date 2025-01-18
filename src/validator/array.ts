import type { ValidationError, Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

export const array = <T extends Validator<any> | Validator<any>[]>(
  itemValidator: T,
): Validator<Array<T extends Validator<infer U> ? U : never>> => {
  const validator = createValidator<Array<any>>((input: unknown) => {
    if (!Array.isArray(input)) {
      return {
        ok: false,
        error: [createError("input is not an array")],
      };
    }

    const result: Array<T extends Validator<infer U> ? U : never> = [];
    const errors: ValidationError[] = [];

    const validators: Validator<any>[] = Array.isArray(itemValidator)
      ? itemValidator
      : [itemValidator];

    for (let i = 0; i < input.length; i++) {
      const value = input[i];
      const currentValidator = validators[i % validators.length];

      const validationResult = currentValidator(value);
      if (!validationResult.ok) {
        errors.push(
          ...validationResult.error.map((e) =>
            createError(`error in item at index ${i}: ${e.message}`)
          ),
        );
      } else {
        result.push(validationResult.value);
      }
    }

    if (errors.length > 0) {
      return {
        ok: false,
        error: errors,
      };
    }

    return {
      ok: true,
      value: result,
    };
  }) as Validator<
    Array<T extends Validator<infer U> ? U : never>
  >;

  return validator;
};
