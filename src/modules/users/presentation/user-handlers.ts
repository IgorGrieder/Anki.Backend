import { Request, Response } from "express";
import { CreateUserDto } from "../application/dtos/create-user-dto";
import { createNewAccount as createNewUser } from "../application/create-new-user";
import { jwt, maxAge, sameSite } from "../../../shared/constants/jwt-constants";
import { loginUser } from "../application/login-user";
import { LoginUserDto } from "../application/dtos/login-user-dto";

export const createUserHandler = async (req: Request, res: Response) => {
  const createuserDto: CreateUserDto = req.body;
  const result = await createNewUser(createuserDto);

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
  const loginUserDto: LoginUserDto = req.body;
  const result = await loginUser(loginUserDto);

  if (result.kind === "success") {
    res.cookie(jwt, result.value.token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === "DEV" ? false : true,
      sameSite,
      maxAge,
    });
    res.status(result.value.code).json({ logged: true });
    return;
  }

  res.status(result.error.code).json({
    logged: false,
    message: result.error.msg,
  });
};
