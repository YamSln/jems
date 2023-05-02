import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../util/http-status-code";
import serverConfig from "../config/server-config";
import { HttpHeader } from "../util/http.header";
import { HttpMethod } from "../util/http.method";

const options = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  response.header(
    HttpHeader.ACCESS_CONTROL_ALLOW_ORIGIN,
    serverConfig.allowedOrigin,
  );
  response.header(
    HttpHeader.ACCESS_CONTROL_ALLOW_METHODS,
    serverConfig.methods.toString(),
  );
  response.header(
    HttpHeader.ACCESS_CONTROL_ALLOW_HEADERS,
    serverConfig.allowedHeaders.toString(),
  );
  if (request.method === HttpMethod.OPTIONS) {
    response.status(HttpStatusCode.OK);
  }
  next();
};

export default options;
