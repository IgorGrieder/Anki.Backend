import { Request, Response } from "express";
import { CreateUserInput } from "../../domain/user/user-types";
import { createNewAccount } from "../../application/user/create-new-user";
import { jwt, maxAge, sameSite } from "../../shared/constants/jwt-constants";

export const createAccountController = async (req: Request, res: Response) => {
  const account: CreateUserInput = req.body;
  const result = await createNewAccount(account);

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

// export const loginAccountController = async (req: Request, res: Response) => {
//   const account: LoginAccount = req.body;
//   const result = await createNewAccount(account);
//
//   if (result.kind === "success") {
//     res.cookie(jwt, result.value.token, {
//       httpOnly: true,
//       secure: process.env.ENVIROMENT === "DEV" ? false : true,
//       sameSite,
//       maxAge,
//     });
//
//     res.status(result.value.code);
//     return;
//   }
//
//   res.status(result.error.code).json({
//     message: result.error.msg,
//   });
// };
