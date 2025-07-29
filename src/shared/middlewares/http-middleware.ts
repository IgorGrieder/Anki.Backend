import { Request, NextFunction, Response } from "express";
import logger from "../logger/logger-module";

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

  logger.httpLogger("Incoming request", requestDetails);
  next();
};
