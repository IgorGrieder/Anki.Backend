import { Router } from "express";
import { createUserSchema, loginUserSchema } from "./user-inputs";
import { genericValidator } from "../../../shared/middlewares/generic-validator";
import { createUserHandler, loginUserHandler } from "./user-handlers";

export const createUserRouter = () => {
  const userRouter = Router();
  const path = "/api/user";

  userRouter.post(
    `${path}/create-user`,
    genericValidator(createUserSchema),
    createUserHandler
  );

  userRouter.post(
    `${path}/login`,
    genericValidator(loginUserSchema),
    loginUserHandler
  );

  return userRouter;
};
