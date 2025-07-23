import { Request, NextFunction, Response } from "express";
import { httpLogger } from "../infra/logger/http-logger";

// Middleware with the purpose of loggin every request sent to the application
export const httpMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const requestDetails = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: req.headers,
    query: req.query,
    body: req.body,
  };

  httpLogger("Incoming request", requestDetails);
  next();
};
