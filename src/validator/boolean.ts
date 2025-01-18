import type { Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

export const boolean = <TExplicit extends boolean>(
  options?: TExplicit,
): Validator<TExplicit extends true ? true : boolean> => {
  const validator = createValidator<boolean>((input: unknown) => {
    if (typeof input !== "boolean") {
      return {
        ok: false,
        error: [createError("input is not boolean")],
      };
    }

    if (options !== undefined) {
      if (input !== options) {
        return {
          ok: false,
          error: [createError(`input is not ${options}`)],
        };
      }
    }

    return {
      ok: true,
      value: input,
    };
  }) as Validator<TExplicit extends true ? true : boolean>;

  return validator;
};
