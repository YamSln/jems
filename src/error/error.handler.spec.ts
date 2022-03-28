import httpMocks from "node-mocks-http";
import { handleErrors, errorTest } from "./error.handler";
import { CustomValidationError } from "./validation.error";
import { ValidationError } from "express-validator";
import {
  FORBIDDEN,
  INCORRECT_PASSWORD,
  NICK_TAKEN,
  NOT_FOUND,
  ROOM_FULL,
  UNAUTHORIZED,
} from "./error.util";

describe("Error Handler Unit Tests", () => {
  it("should return BAD_REQUEST on CustomValidationError", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new CustomValidationError([]);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(400);
    expect(response._getData().message).toEqual(errorTest.ERROR_MESSAGE);
    expect(response._getData().statusCode).toEqual(400);
    expect(response._getData().timeStamp).not.toBeUndefined();
    expect(response._getData().errors).toEqual([]);
  });
  it("should return NOT_FOUND on not found error", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new Error(NOT_FOUND);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(404);
    expect(response._getData().message).toEqual(NOT_FOUND);
    expect(response._getData().statusCode).toEqual(404);
    expect(response._getData().timeStamp).not.toBeUndefined();
  });
  it("should return UNAUTHORIZED on unauthorized error", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new Error(UNAUTHORIZED);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(401);
    expect(response._getData().message).toEqual(UNAUTHORIZED);
    expect(response._getData().statusCode).toEqual(401);
    expect(response._getData().timeStamp).not.toBeUndefined();
  });
  it("should return FORBIDDEN on forbidden error", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new Error(FORBIDDEN);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(403);
    expect(response._getData().message).toEqual(FORBIDDEN);
    expect(response._getData().statusCode).toEqual(403);
    expect(response._getData().timeStamp).not.toBeUndefined();
  });
  it("should return BAD_REQUEST on INCORRECT_PASSWORD error", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new Error(INCORRECT_PASSWORD);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(400);
    expect(response._getData().message).toEqual(INCORRECT_PASSWORD);
    expect(response._getData().statusCode).toEqual(400);
    expect(response._getData().timeStamp).not.toBeUndefined();
  });
  it("should return BAD_REQUEST on NICK_TAKEN error", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new Error(NICK_TAKEN);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(400);
    expect(response._getData().message).toEqual(NICK_TAKEN);
    expect(response._getData().statusCode).toEqual(400);
    expect(response._getData().timeStamp).not.toBeUndefined();
  });
  it("should return BAD_REQUEST on ROOM_FULL error", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const error = new Error(ROOM_FULL);

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(400);
    expect(response._getData().message).toEqual(ROOM_FULL);
    expect(response._getData().statusCode).toEqual(400);
    expect(response._getData().timeStamp).not.toBeUndefined();
  });
  it("should return ERROR on unhandled error and log", () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const UNHANDLED_ERROR = "UNHANDLED";
    const error = new Error(UNHANDLED_ERROR);

    let logged;
    console.error = (message: string, params: []) => {
      logged = message;
    };

    handleErrors(request, error, response);

    expect(response.statusCode).toEqual(500);
    expect(response._getData().message).toContain(UNHANDLED_ERROR);
    expect(response._getData().statusCode).toEqual(500);
    expect(response._getData().timeStamp).not.toBeUndefined();
    expect(logged).toContain(errorTest.REQUESTOR);
    expect(logged).toContain(UNHANDLED_ERROR);
  });
});
