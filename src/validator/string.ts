import type { Validator } from "../types/validator";
import { createError, createValidator } from "../utils/create";

interface StringOptions {
  min?: number;
  max?: number;
  length?: number;
  regex?: RegExp;
}

export const string = <TExplicit extends string>(
  options: TExplicit | StringOptions = {},
): Validator<TExplicit> => {
  const isExplictString = typeof options === "string";
  const {
    min,
    max,
    length,
    regex,
  } = isExplictString ? {} : options;

  const validator = createValidator<string>((input: unknown, path: (string | number)[] = []) => {
    if (typeof input !== "string") {
      return {
        ok: false,
        error: [createError("input is not string", path)],
      };
    }

    if (options) {
      if (isExplictString) {
        if (input !== options) {
          return {
            ok: false,
            error: [createError(`input is not '${options}'`, path)],
          };
        }
      } else {
        if (length && input.length !== length) {
          return {
            ok: false,
            error: [createError(`input length is not ${length}`, path)],
          };
        } else {
          if (min && input.length < min) {
            return {
              ok: false,
              error: [createError(`input length is less than ${min}`, path)],
            };
          }

          if (max && input.length > max) {
            return {
              ok: false,
              error: [createError(`input length is greater than ${max}`, path)],
            };
          }
        }

        if (regex && !regex.test(input)) {
          return {
            ok: false,
            error: [
              createError(`input does not match regex ${regex.toString()}`, path),
            ],
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
