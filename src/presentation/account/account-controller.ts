import { Request, Response } from "express";
import { Account } from "../../domain/account/account-type";
import { createNewAccount } from "../../application/user/create-new-account";
import { jwt, maxAge, sameSite } from "../../shared/constants/jwt-constants";

export const createAccountController = async (req: Request, res: Response) => {
  const account: Account = req.body;
  const result = await createNewAccount(account);

  if (result.kind === 'success') {
    res.cookie(jwt, result.value.token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === "DEV" ? false : true,
      sameSite,
      maxAge,
    });

    res
      .status(result.value.code);
    return;
  }

  res.status(result.error.code).json({
    message: result.error.msg,
  });
}
