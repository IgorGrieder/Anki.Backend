import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../shared/types/types";
import { hashPassword } from "../../../shared/auth/hash-password";
import { generateJWT } from "../../../shared/auth/generate-jwt";
import logger from "../../../shared/logger/logger-module";
import {
  httpCodes,
  resMessages,
} from "../../../shared/constants/constants-module";
import { isDuplicateKeyError } from "../../../shared/utils/helpers";
import { CreateUserInput } from "../presentation/user-inputs";
import { createNewUser } from "../data-access/user-repository";

interface Success extends GenericSuccess {
  token: string;
}

export const createUser = async (
  user: CreateUserInput
): Promise<Result<Success, GenericError>> => {
  try {
    const userPassHashed = await hashPassword(user);
    const createdUser = await createNewUser(userPassHashed);

    if (!createdUser) {
      return {
        kind: "error",
        error: {
          code: httpCodes.internalServerError,
          msg: resMessages.unexpectedError,
        },
      };
    }

    const token = generateJWT(createdUser);

    return {
      kind: "success",
      value: { code: httpCodes.created, token },
    };
  } catch (err: any) {
    logger.errorLogger("Error trying to create a new user", err);

    if (isDuplicateKeyError(err)) {
      return {
        kind: "error",
        error: {
          code: httpCodes.badRequest,
          msg: "Email/username already in use",
        },
      };
    }

    return {
      kind: "error",
      error: {
        code: httpCodes.internalServerError,
        msg: resMessages.unexpectedError,
      },
    };
  }
};
