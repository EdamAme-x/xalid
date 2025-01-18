import type { Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

interface StringOptions<TStrict extends boolean> {
  strict?: TStrict;
}

export const nullish = <TStrict extends boolean>(options?: StringOptions<TStrict>): Validator<TStrict extends true ? null : null | undefined> => {
  const { strict } = {
    strict: false,
    ...options,
  };

  const validator = createValidator<null | undefined>((input: unknown) => {
    if (strict) {
      if (input !== null) {
        return {
          ok: false,
          error: [createError("input is not null")],
        };
      }
    }else {
      if (input !== null && input !== undefined) {
        return {
          ok: false,
          error: [createError("input is not nullish")],
        };
      }
    }

    return {
      ok: true,
      value: input,
    };
  }) as Validator<TStrict extends true ? null : null | undefined>;

  return validator;
};
