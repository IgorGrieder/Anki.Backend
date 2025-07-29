import { Request, Response, NextFunction } from "express";
import { httpCodes } from "../constants/http-code-constants";
import z from "zod";

export const genericBodyValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(httpCodes.badRequest).json({
        message: "Validation failed",
        errors: result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      });
      return;
    }

    req.body.validated = result.data;
    next();
  };
};
