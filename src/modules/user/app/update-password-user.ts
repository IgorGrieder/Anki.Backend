import { httpCodes } from "../../../shared/constants/http-code-constants";
import { resMessages } from "../../../shared/constants/message-constants";
import {
  GenericError,
  GenericSuccess,
  Result,
} from "../../../shared/types/types";
import { PasswordChangeInput } from "../common/user-types";
import logger from "../../../shared/logger/logger-module";
import { UserModel } from "../data-access/user-model";
import bcrypt from "bcryptjs/umd/types";
import { hashPassword } from "../../../shared/auth/auth-module";

export const changeUserPassword = async (
  userPasswordChange: PasswordChangeInput
): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    const result = await UserModel.findOne({
      $or: [
        { username: userPasswordChange.login },
        { email: userPasswordChange.login },
      ],
    });

    // We can return if we dont find a match
    if (!result?.password_hash) {
      return {
        kind: "error",
        error: {
          code: httpCodes.badRequest,
          msg: resMessages.userNotFound,
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(
      userPasswordChange.oldPassword,
      result.password_hash
    );

    if (!isPasswordValid) {
      return {
        kind: "error",
        error: {
          code: httpCodes.badRequest,
          msg: resMessages.invalidPassword,
        },
      };
    }

    // Hashing the new password
    const userPassHashed = await hashPassword(userPasswordChange);

    await UserModel.updateOne(
      { _id: result._id },
      { $set: { password: userPassHashed.password } }
    );

    return { kind: "success", value: { code: httpCodes.noContent } };
  } catch (err: any) {
    logger.errorLogger("Error trying to update user password", err);
    return {
      kind: "error",
      error: {
        code: httpCodes.internalServerError,
        msg: resMessages.unexpectedError,
      },
    };
  }
};
