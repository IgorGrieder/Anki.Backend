import { Request, Response, NextFunction } from "express";
import {
  httpCodeConstants,
  messageConstants,
} from "../../shared/constants/constants-module";
import { errorLogger } from "../logger/error-logger";
import { validateJWT } from "../auth/validate-jwt";

export const validateJWTMiddlewear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res
        .status(httpCodeConstants.unauthorized)
        .json({ message: messageConstants.noToken });
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
    errorLogger("Error trying to validate JWT Token", err);
    res
      .status(httpCodeConstants.unauthorized)
      .json({ message: messageConstants.invalidToken });
    return;
  }
};
