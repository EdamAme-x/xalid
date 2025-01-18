export type ValidationError = {
  readonly message: string;
  readonly path?: (string | number)[];
};

export type ValidationResult<TInput> = {
  readonly ok: true;
  readonly value: TInput;
} | {
  readonly ok: false;
  readonly error: ValidationError[];
};

export type InternalValidator<TInput> = (
  input: unknown,
) => ValidationResult<TInput>;

export type Validator<TInput> = InternalValidator<TInput> & {};
