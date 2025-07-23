import { Router } from "express";
import * as UserHandlers from "./user-handlers";
import { createUserSchema } from "../application/dtos/create-user-dto";
import { loginUserSchema } from "../application/dtos/login-user-dto";
import { genericValidator } from "../../../shared/middlewares/generic-validator";

export const userRouter = Router();
export const path = "/api/user";

userRouter.post(
  `${path}/create-user`,
  genericValidator(createUserSchema),
  UserHandlers.createUserHandler
);

userRouter.post(
  `${path}/login`,
  genericValidator(loginUserSchema),
  UserHandlers.loginUserHandler
);
