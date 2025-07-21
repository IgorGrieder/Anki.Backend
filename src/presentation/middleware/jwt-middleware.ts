import { Request, Response, NextFunction } from "express";
import { unauthorizedCode } from "../../shared/constants/http-code-constants";
import {
  noToken,
  invalidToken,
} from "../../shared/constants/message-constants";
import { errorLogger } from "../../infra/logger/error-logger";
import { validateJWT } from "../../infra/auth/validate-jwt";

export const validateJWTMiddlewear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(unauthorizedCode).json({ message: noToken });
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
    res.status(unauthorizedCode).json({ message: invalidToken });
    return;
  }
};
