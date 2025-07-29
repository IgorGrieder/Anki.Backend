import { Request, Response, NextFunction } from "express";
import { httpCodes, resMessages } from "../constants/constants-module";
import logger from "../logger/logger-module";
import { validateJWT } from "../auth/validate-jwt";

export const validateJWTMiddlewear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(httpCodes.unauthorized).json({ message: resMessages.noToken });
      return;
    }

    const result = await validateJWT(token);

    if (result.kind === "error") {
      res.status(result.error.code).json({ message: result.error.message });
      return;
    }

    req.body.jwt = result.value.decoded;
    next();
  } catch (err: any) {
    logger.errorLogger("Error trying to validate JWT Token", err);
    res
      .status(httpCodes.unauthorized)
      .json({ message: resMessages.invalidToken });
    return;
  }
};
