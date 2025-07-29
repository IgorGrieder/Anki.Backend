import { Router } from "express";
import { createUserSchema, loginUserSchema } from "./user-inputs";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import { createUserHandler, loginUserHandler } from "./user-handlers";

export const createUserRouter = () => {
  const userRouter = Router();
  const path = "/user";

  userRouter.post(
    `${path}/create-user`,
    genericBodyValidator(createUserSchema),
    createUserHandler
  );

  userRouter.post(
    `${path}/login`,
    genericBodyValidator(loginUserSchema),
    loginUserHandler
  );

  return userRouter;
};
