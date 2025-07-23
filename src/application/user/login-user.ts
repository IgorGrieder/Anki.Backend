import { Request, Response } from "express";

export const loginAccount = async (loginAccount: LoginAccount) => {
  const result = await LoginService.logIn(req.body);

  if (result.success) {
    res.cookie(jwt, result.token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === "DEV" ? false : true,
      sameSite,
      maxAge,
    });

    return res
      .status(okCode)
      .json({ logged: true, username: result.user.username });
  }

  // Internal server error
  if (result.code === internalServerErrorCode) {
    return res.status(result.code).json({
      logged: false,
      message: unexpectedError,
    });
  }

  // Unauthorized log in
  return res.status(result.code).json({
    logged: false,
    message: unauthorizedMessage,
  });
});
