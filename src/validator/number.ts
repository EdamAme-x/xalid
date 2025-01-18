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

  const validator = createValidator<number>((input: unknown, path: (string | number)[] = []) => {
    if (typeof input !== "number") {
      return {
        ok: false,
        error: [createError("input is not number", path)],
      };
    }

    if (options) {
      if (isExplictNumber) {
        if (input !== options) {
          return {
            ok: false,
            error: [createError(`input is not ${options}`, path)],
          };
        }
      } else {
        if (min && input < min) {
          return {
            ok: false,
            error: [createError(`input is less than ${min}`, path)],
          };
        }

        if (max && input > max) {
          return {
            ok: false,
            error: [createError(`input is greater than ${max}`, path)],
          };
        }

        if (integer && !Number.isInteger(input)) {
          return {
            ok: false,
            error: [createError("input is not integer", path)],
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
