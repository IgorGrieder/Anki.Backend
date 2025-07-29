import { Router } from "express";
import { createUserSchema, loginUserSchema } from "./user-inputs";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import * as UserHandlers from "./user-handlers";

export const createUserRouter = () => {
  const userRouter = Router();
  const path = "/user";

  userRouter.post(
    `${path}/create-user`,
    genericBodyValidator(createUserSchema),
    UserHandlers.createUserHandler
  );

  userRouter.post(
    `${path}/login`,
    genericBodyValidator(loginUserSchema),
    UserHandlers.loginUserHandler
  );

  return userRouter;
};
