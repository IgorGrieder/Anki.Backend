import { UserModel } from "../../adapter/driven/mongoose/user-model";
import { LoginUserDto } from "./dtos/login-user-dto";
import { UserDocument, userDocumentSchema } from "../domain/user-types";
import { validateWithSchema } from "../../../../shared/utils/generic-schema-validator";
import { generateJWT } from "../../../../shared/auth/generate-jwt";
import { errorLogger } from "../../../shared/logger/error-logger";
import {
  unauthorizedCode,
  notFoundCode,
  internalServerErrorCode,
  okCode,
} from "../../../../shared/constants/http-code-constants";
import {
  unexpectedError,
  userNotFound,
  invalidPassword,
} from "../../../../shared/constants/message-constants";
import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../../shared/types/types";
import bcrypt from "bcryptjs";

interface Success extends GenericSuccess {
  token: string;
}

export const loginUser = async (
  user: LoginUserDto
): Promise<Result<Success, GenericError>> => {
  try {
    const result = await UserModel.findOne({
      $or: [{ username: user.login }, { email: user.login }],
    }).lean();

    const data = validateWithSchema<UserDocument>(userDocumentSchema, result);

    if (!result) {
      return {
        kind: "error",
        error: { code: notFoundCode, msg: userNotFound },
      };
    }

    if (!result.password_hash) {
      return {
        kind: "error",
        error: { code: unauthorizedCode, msg: invalidPassword },
      };
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      result.password_hash
    );
    if (!isPasswordValid) {
      return {
        kind: "error",
        error: { code: unauthorizedCode, msg: invalidPassword },
      };
    }

    const token = generateJWT(data);
    return {
      kind: "success",
      value: { code: okCode, token },
    };
  } catch (err: any) {
    errorLogger("Error during user login", err);
    return {
      kind: "error",
      error: { code: internalServerErrorCode, msg: unexpectedError },
    };
  }
};
