import { Request, Response, NextFunction } from "express";

// Used to catch errors raised from services, passing them to the error handler
export const catchErrors = (action: any) => (
  request: Request,
  response: Response,
  next: NextFunction
) => action(request, response).catch(next);
