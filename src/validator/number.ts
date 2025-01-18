import type { Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

interface NumberOptions {
  min?: number;
  max?: number;
  integer?: boolean;
}

export const number = <TExplicit extends number>(
  options: TExplicit | NumberOptions = {},
): Validator<TExplicit> => {
  const isExplictNumber = typeof options === "number";
  const {
    min,
    max,
    integer,
  } = isExplictNumber ? {} : options;

  const validator = createValidator<number>((input: unknown) => {
    if (typeof input !== "number") {
      return {
        ok: false,
        error: [createError("input is not number")],
      };
    }

    if (options) {
      if (isExplictNumber) {
        if (input !== options) {
          return {
            ok: false,
            error: [createError(`input is not ${options}`)],
          };
        }
      } else {
        if (min && input < min) {
          return {
            ok: false,
            error: [createError(`input is less than ${min}`)],
          };
        }

        if (max && input > max) {
          return {
            ok: false,
            error: [createError(`input is greater than ${max}`)],
          };
        }

        if (integer && !Number.isInteger(input)) {
          return {
            ok: false,
            error: [createError("input is not integer")],
          };
        }
      }
    }

    return {
      ok: true,
      value: input,
    };
  }) as Validator<TExplicit>;

  return validator;
};
