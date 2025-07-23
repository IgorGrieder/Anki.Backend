import { Router } from "express";
import { createAccountController } from "./user-controller";
import { createUserSchema } from "../../domain/user/user-schemas";
import { genericValidator } from "../middleware/generic-validator";

export const accountRouter = Router();
export const path = "/api/account";

accountRouter.post(
  `${path}/create-account`,
  genericValidator(createUserSchema),
  createAccountController
);
