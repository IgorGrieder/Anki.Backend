import { Request, Response } from "express";
import { CreateUserDto } from "../../core/use-cases/dtos/create-user-dto";
import { LoginUserDto } from "../../core/use-cases/dtos/login-user-dto";
import { jwtConstants } from "../../../../shared/constants/jwt-constants";

export const createUserHandler = async (req: Request, res: Response) => {
  const createuserDto: CreateUserDto = req.body.validated;
  const result = await userController.createUser(createuserDto);

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
  const loginUserDto: LoginUserDto = req.body.validated;
  const result = await userController.loginUser(loginUserDto);

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
