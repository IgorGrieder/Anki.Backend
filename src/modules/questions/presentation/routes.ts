import { Router } from "express";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import { validateJWTMiddlewear } from "../../../shared/middlewares/jwt-middleware";
import { generateQuestionsSchema } from "../common/types";
import { generateQuestionsHandler } from "./handlers";

export const createQuestionsRouter = () => {
  const router = Router();
  const path = "/questions";

  router.post(
    `${path}/generate`,
    validateJWTMiddlewear,
    genericBodyValidator(generateQuestionsSchema),
    generateQuestionsHandler
  );

  return router;
};
