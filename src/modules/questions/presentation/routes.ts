import { Router } from "express";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import { validateJWTMiddlewear } from "../../../shared/middlewares/jwt-middleware";
import { generateQuestionsSchema } from "../common/types";
import { generateQuestionsHandler } from "./handlers";

export const createQuestionsRouter = () => {
  const router = Router();
  const path = "/questions";

  /**
   * @openapi
   * /api/questions/generate:
   *   post:
   *     tags:
   *       - Questions
   *     summary: Generate flashcard questions via LLM with vector cache
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               topic:
   *                 type: string
   *               numQuestions:
   *                 type: integer
   *               language:
   *                 type: string
   *     responses:
   *       '200':
   *         description: Questions generated or retrieved from cache
   *       '401':
   *         description: Unauthorized
   */
  router.post(`${path}/generate`, validateJWTMiddlewear, genericBodyValidator(generateQuestionsSchema), generateQuestionsHandler);

  return router;
};
