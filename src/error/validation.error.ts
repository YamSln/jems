import { ValidationError } from "express-validator";

export class CustomValidationError extends Error {
  private errors: string[];
  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors.map((validationError) => validationError.msg);
  }

  get err() {
    return this.errors;
  }
}
