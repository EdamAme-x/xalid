import type { ValidationResult, Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

export const any = <TOutput>(
  options?: (input: unknown) => boolean | ValidationResult<TOutput>,
): Validator<TOutput> => {
  const validator = createValidator<unknown>((input: unknown, path: (string | number)[] = []) => {
    if (options) {
      const result = options(input);

      if (typeof result === "boolean") {
        if (!result) {
          return {
            ok: false,
            error: [createError("input is not valid", path)],
          };
        }
      } else {
        return result;
      }
    }

    return {
      ok: true,
      value: input,
    };
  }) as Validator<TOutput>;

  return validator;
};
