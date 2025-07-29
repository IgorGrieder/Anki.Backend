import { Request, Response, NextFunction } from "express";
import z from "zod";
import { badRequest } from "../../shared/constants/http-code-constants";

export const genericValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  target: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let data;
    switch (target) {
      case "body":
        data = req.body;
        break;
      case "params":
        data = req.params;
        break;
      case "query":
        data = req.query;
        break;
      default:
        data = req.body;
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      res.status(badRequest).json({
        message: "Validation failed",
        errors: result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      });
      return;
    }

    next();
  };
};
