import { Request, Response } from "express";
import {
  httpCodes,
  jwtConstants,
  resMessages,
} from "../../../shared/constants/constants-module";
import { createUser } from "../app/create-user";
import { loginUser } from "../app/login-user";
import {
  CreateUserInput,
  DeleteUserInput,
  LoginUserInput,
  PasswordChangeInput,
} from "../common/user-types";
import { deleteUser } from "../app/delete-user";
import { changeUserPassword } from "../app/update-password-user";
import { requestPasswordReset } from "../app/request-password-reset";
import { performPasswordReset } from "../app/perform-password-reset";
import { RequestPasswordResetInput, PerformPasswordResetInput } from "../common/user-types";

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
    message: result.error.msg,
  });
};

export const logoutHandler = (_: Request, res: Response) => {
  res.clearCookie("jwt");
  res
    .status(httpCodes.ok)
    .json({ loggedOut: true, message: resMessages.logoutMessage });
  return;
};

export const deleteUserHanlder = async (req: Request, res: Response) => {
  const deleteUserInput: DeleteUserInput = req.body.validated;
  const result = await deleteUser(deleteUserInput);

  if (result.kind === "success") {
    res.status(result.value.code);
    return;
  }

  res.status(result.error.code).json({
    message: result.error.msg,
  });
};

export const changePasswordHandler = async (req: Request, res: Response) => {
  const userPassChange: PasswordChangeInput = req.body.validated;
  const result = await changeUserPassword(userPassChange);

  if (result.kind === "success") {
    res.status(result.value.code);
    return;
  }

  res.status(result.error.code).json({
    message: result.error.msg,
  });
};

export const requestPasswordResetHandler = async (req: Request, res: Response) => {
  const input: RequestPasswordResetInput = req.body.validated;
  const result = await requestPasswordReset(input);
  if (result.kind === "success") {
    res.status(result.value.code).send();
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const performPasswordResetHandler = async (req: Request, res: Response) => {
  const input: PerformPasswordResetInput = req.body.validated;
  const result = await performPasswordReset(input);
  if (result.kind === "success") {
    res.status(result.value.code).send();
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};
