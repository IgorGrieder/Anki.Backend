import { Router } from "express";
import { createUserHandler, loginUserHandler } from "./http-handlers";
import { createUserSchema } from "../../core/use-cases/dtos/create-user-dto";
import { loginUserSchema } from "../../core/use-cases/dtos/login-user-dto";
import { genericValidator } from "../../../../shared/middlewares/generic-validator";
import { IUserController } from "../../port/driving/user-controller";

export const createUserRouter = (userController: IUserController) => {
  const userRouter = Router();
  const path = "/api/user";

  userRouter.post(
    `${path}/create-user`,
    genericValidator(createUserSchema),
    createUserHandler(userController)
  );

  userRouter.post(
    `${path}/login`,
    genericValidator(loginUserSchema),
    loginUserHandler(userController)
  );

  return userRouter;
};
