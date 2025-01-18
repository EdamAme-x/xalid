import type { Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

export const boolean = <TExplicit extends boolean>(
  options?: TExplicit,
): Validator<TExplicit extends true ? true : boolean> => {
  const validator = createValidator<boolean>((input: unknown, path: (string | number)[] = []) => {
    if (typeof input !== "boolean") {
      return {
        ok: false,
        error: [createError("input is not boolean", path)],
      };
    }

    if (options !== undefined) {
      if (input !== options) {
        return {
          ok: false,
          error: [createError(`input is not ${options}`, path)],
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
