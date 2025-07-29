import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../shared/types/types";
import { LoginUserInput } from "../presentation/user-inputs";
import { generateJWT } from "../../../shared/auth/generate-jwt";
import logger from "../../../shared/logger/logger-module";
import {
  httpCodes,
  resMessages,
} from "../../../shared/constants/constants-module";
import bcrypt from "bcryptjs";
import { UserModel } from "../data-access/user-model";
import { User, UserDocument } from "../user-types";

interface Success extends GenericSuccess {
  token: string;
}

const updateLastLogin = async (user: UserDocument) => {
  await UserModel.findByIdAndUpdate(user._id, {
    last_login_at: new Date(),
  });
};

export const loginUser = async (
  user: LoginUserInput
): Promise<Result<Success, GenericError>> => {
  try {
    const userFound = await UserModel.findOne({
      $or: [{ email: user.login }, { username: user.login }],
    });

    if (!userFound) {
      return {
        kind: "error",
        error: { code: httpCodes.notFound, msg: resMessages.userNotFound },
      };
    }

    if (!userFound.password_hash) {
      return {
        kind: "error",
        error: {
          code: httpCodes.unauthorized,
          msg: resMessages.invalidPassword,
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      userFound.password_hash
    );
    if (!isPasswordValid) {
      return {
        kind: "error",
        error: {
          code: httpCodes.unauthorized,
          msg: resMessages.invalidPassword,
        },
      };
    }

    // Updating the user last login
    updateLastLogin(userFound);

    // Generate JWT token
    const token = generateJWT(userFound);

    return {
      kind: "success",
      value: { code: httpCodes.ok, token },
    };
  } catch (err: any) {
    logger.errorLogger("Error during user login", err);
    return {
      kind: "error",
      error: {
        code: httpCodes.internalServerError,
        msg: resMessages.unexpectedError,
      },
    };
  }
};
