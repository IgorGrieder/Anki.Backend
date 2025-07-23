import { Request, Response } from "express";
import {
  CreateUserInput,
  LoginUserInput,
} from "../application/dtos/create-user-dto";
import { createNewAccount as createNewUser } from "../application/create-new-user";
import { jwt, maxAge, sameSite } from "../../../shared/constants/jwt-constants";
import { loginUser } from "../application/login-user";

export const createUserHandler = async (req: Request, res: Response) => {
  const createUserInput: CreateUserInput = req.body;
  const result = await createNewUser(createUserInput);

  if (result.kind === "success") {
    res.cookie(jwt, result.value.token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === "DEV" ? false : true,
      sameSite,
      maxAge,
    });

    res.status(result.value.code);
    return;
  }

  res.status(result.error.code).json({
    message: result.error.msg,
  });
};

export const loginUserHandler = async (req: Request, res: Response) => {
  const loginUserInput: LoginUserInput = req.body;
  const result = await loginUser(loginUserInput);

  // if (result.success) {
  //   res.cookie("jwt", result.token, {
  //     httpOnly: true,
  //     secure: process.env.ENVIROMENT === "DEV" ? false : true,
  //     sameSite: "strict",
  //     maxAge: 3600000,
  //   });
  //
  //   res
  //     .status(200)
  //     .json({ logged: true, username: result.user.username });
  //   return
  // }
  //
  // // Internal server error
  // if (result.code === 500) {
  //   res.status(500).json({
  //     logged: false,
  //     message: "An unexpected error occurred.",
  //   });
  //   return
  // }
  //
  // // Unauthorized log in
  // res.status(401).json({
  //   logged: false,
  //   message: "Invalid credentials",
  // });
};
