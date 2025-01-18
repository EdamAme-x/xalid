import type { ValidationError, Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

export const object = <T extends Record<string, Validator<any>>>(
  options: T,
): Validator<
  { [K in keyof T]: T[K] extends Validator<infer U> ? U : never }
> => {
  const properties = options;

  const validator = createValidator<Record<string, any>>((input: unknown) => {
    if (typeof input !== "object" || input === null) {
      return {
        ok: false,
        error: [createError("input is not object")],
      };
    }

    const result: Record<string, any> = {};
    const errors: ValidationError[] = [];

    for (let i = 0, keys = Object.keys(properties), len = keys.length; i < len; i++) {
      const key = keys[i];
      const propertyValidator = properties[key];
      const value = (input as Record<string, any>)[key];

      const validationResult = propertyValidator(value);
      if (!validationResult.ok) {
        errors.push(
          ...validationResult.error.map((e) =>
            createError(`error in property '${key}': ${e.message}`)
          ),
        );
      } else {
        result[key] = validationResult.value;
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
    { [K in keyof T]: T[K] extends Validator<infer U> ? U : never }
  >;

  return validator;
};
