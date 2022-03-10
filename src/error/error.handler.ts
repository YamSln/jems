import { Response } from "express";
import { HttpStatusCode } from "../util/http-status-code";
import { ClientError } from "./client.error";
import { ClientValidationError } from "./client.validation-error";
import {
  FORBIDDEN,
  INCORRECT_PASSWORD,
  NOT_FOUND,
  UNAUTHORIZED,
} from "./error.util";
import { CustomValidationError } from "./validation.error";

const ERROR_MESSAGE = "Errors during parameters validation";

// Handles errors from api endpoints, sending matching error response
export const handleErrors = (err: Error, response: Response) => {
  if (err instanceof CustomValidationError) {
    return response // Validation errors
      .status(HttpStatusCode.BAD_REQUEST)
      .send(
        new ClientValidationError(
          ERROR_MESSAGE,
          HttpStatusCode.BAD_REQUEST,
          err.err // Array that contains error messages
        )
      );
  }
  switch (err.message) {
    case NOT_FOUND:
      return response // Not found errors
        .status(HttpStatusCode.NOT_FOUND)
        .send(new ClientError(err.message, HttpStatusCode.NOT_FOUND));
    case UNAUTHORIZED:
      return response // Authorization errors
        .status(HttpStatusCode.UNAUTHORIZED)
        .send(new ClientError(err.message, HttpStatusCode.UNAUTHORIZED));
    case FORBIDDEN:
      return response // Forbidden errors
        .status(HttpStatusCode.FORBIDDEN)
        .send(new ClientError(err.message, HttpStatusCode.FORBIDDEN));
    case INCORRECT_PASSWORD:
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .send(new ClientError(err.message, HttpStatusCode.BAD_REQUEST));
    default:
      return response // Default server error
        .status(HttpStatusCode.ERROR)
        .send(new ClientError(err.message, HttpStatusCode.ERROR));
  }
};
