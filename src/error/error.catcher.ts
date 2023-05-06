import { Request, Response, NextFunction } from "express";

// Used to catch errors raised from services, passing them to the error handler
export function catchErrors(action: any) {
  return (request: Request, response: Response, next: NextFunction) =>
    action(request, response).catch(next);
}
