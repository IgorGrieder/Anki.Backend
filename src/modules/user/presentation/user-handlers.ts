import { Request, Response } from "express";
import { jwtConstants } from "../../../shared/constants/constants-module";
import { createUser } from "../app/create-user";
import { loginUser } from "../app/login-user";
import { CreateUserInput, LoginUserInput } from "../common/user-types";

export const createUserHandler = async (req: Request, res: Response) => {
  const createUserInput: CreateUserInput = req.body.validated;
  const result = await createUser(createUserInput);

  if (result.kind === "success") {
    res.cookie(jwtConstants.cookieName, result.value.token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === "DEV" ? false : true,
      sameSite: jwtConstants.sameSite as "strict",
      maxAge: jwtConstants.maxAge,
    });

    res.status(result.value.code);
    return;
  }

  res.status(result.error.code).json({
    message: result.error.msg,
  });
};

export const loginUserHandler = async (req: Request, res: Response) => {
  const loginUserInput: LoginUserInput = req.body.validated;
  const result = await loginUser(loginUserInput);

  if (result.kind === "success") {
    res.cookie(jwtConstants.cookieName, result.value.token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === "DEV" ? false : true,
      sameSite: jwtConstants.sameSite as "strict",
      maxAge: jwtConstants.maxAge,
    });
    res.status(result.value.code).json({ logged: true });
    return;
  }

  res.status(result.error.code).json({
    logged: false,
    message: result.error.msg,
  });
};
