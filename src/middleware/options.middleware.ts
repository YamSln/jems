import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../util/http-status-code";
import serverConfig from "../config/server-config";

const options = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  response.header("Access-Control-Allow-Origin", serverConfig.allowedOrigin);
  response.header(
    "Access-Control-Allow-Methods",
    serverConfig.methods.toString(),
  );
  response.header(
    "Access-Control-Allow-Headers",
    serverConfig.allowedHeaders.toString(),
  );
  if (request.method == "OPTIONS") {
    response.status(HttpStatusCode.OK);
  }
  next();
};

export { options };
