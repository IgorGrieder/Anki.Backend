import { UserDocument, userDocumentSchema } from "../domain/user-types";
import { CreateUserDto } from "./dtos/create-user-dto";
import { errorLogger } from "../../../shared/logger/error-logger";
import { generateJWT, hashPassword } from "../../../../shared/auth/auth-module";
import { validateWithSchema } from "../../../../shared/utils/generic-schema-validator";
import {
  httpCodeConstants,
  messageConstants,
} from "../../../../shared/constants/constants-module";
import {
  GenericError,
  GenericSuccess,
  Result,
} from "../../../../shared/types/types";
import { UserModel } from "../../adapter/driven/mongoose/user-model";
import { isDuplicateKeyError } from "../../../../shared/utils/helpers";

interface Success extends GenericSuccess {
  token: string;
}

export const createNewAccount = async (
  user: CreateUserDto
): Promise<Result<Success, GenericError>> => {
  try {
    const userPassHashed = await hashPassword(user);
    const createdUser = await UserModel.create(userPassHashed);
    const data = validateWithSchema<UserDocument>(
      userDocumentSchema,
      createdUser
    );
    const token = generateJWT(data);

    return {
      kind: "success",
      value: { code: httpCodeConstants.created, token },
    };
  } catch (err: any) {
    errorLogger("Error trying to create a new user", err);

    if (isDuplicateKeyError(err)) {
      return {
        kind: "error",
        error: {
          code: httpCodeConstants.badRequest,
          msg: "Email/username already in use",
        },
      };
    }

    return {
      kind: "error",
      error: {
        code: httpCodeConstants.internalServerError,
        msg: messageConstants.unexpectedError,
      },
    };
  }
};
