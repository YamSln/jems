import { Request, Response } from "express";
import { HttpStatusCode } from "../util/http-status-code";
import { ClientError } from "./client.error";
import { ClientValidationError } from "./client.validation-error";
import {
  FORBIDDEN,
  INCORRECT_PASSWORD,
  NICK_TAKEN,
  NOT_FOUND,
  ROOM_FULL,
  UNAUTHORIZED,
} from ".";
import { CustomValidationError } from "./validation.error";
import { log } from "../log";

const REQUESTOR = "ERROR_HANDLER";
const ERROR_MESSAGE = "Errors during parameters validation";

// Handles errors from api endpoints, sending matching error response
const handleErrors = (request: Request, err: Error, response: Response) => {
  if (err instanceof CustomValidationError) {
    return response // Validation errors
      .status(HttpStatusCode.BAD_REQUEST)
      .send(
        new ClientValidationError(
          ERROR_MESSAGE,
          HttpStatusCode.BAD_REQUEST,
          err.err, // Array that contains error messages
        ),
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
    case NICK_TAKEN:
    case ROOM_FULL:
      return response
        .status(HttpStatusCode.BAD_REQUEST)
        .send(new ClientError(err.message, HttpStatusCode.BAD_REQUEST));
    default:
      log.error(REQUESTOR, "Unhandled Error at - " + request.url, err);
      return response // Default server error
        .status(HttpStatusCode.ERROR)
        .send(new ClientError(err.message, HttpStatusCode.ERROR));
  }
};

export default handleErrors;

export const errorTest = {
  ERROR_MESSAGE,
  REQUESTOR,
};
