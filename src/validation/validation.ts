import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { CustomValidationError } from "../error";

function makeValidation(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Check request for validation errors
  const results: Result<ValidationError> = validationResult(request);
  if (!results.isEmpty()) {
    // If validation errors exists, call next with error
    next(new CustomValidationError(results.array()));
  } else {
    next();
  }
}

export default {
  makeValidation,
};
