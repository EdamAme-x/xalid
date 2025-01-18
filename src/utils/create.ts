import type {
  InternalValidator,
  ValidationError,
  ValidationResult,
} from "../types/validator";

export const createValidator = <TInput>(
  validator: InternalValidator<TInput>,
): InternalValidator<TInput> => {
  return function (input: unknown) {
    return validator(input);
  };
};

export const createError = (
  message: string,
  path: (string | number)[],
): ValidationError => ({
  message,
  path,
});
