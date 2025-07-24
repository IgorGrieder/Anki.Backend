import { UserDocument, userDocumentSchema } from "../domain/user-types";
import { CreateUserDto } from "./dtos/create-user-dto";
import { errorLogger } from "../../../shared/logger/error-logger";
import { generateJWT, hashPassword } from "../../../shared/auth/auth-module";
import { validateWithSchema } from "../../../shared/utils/generic-schema-validator";
import {
  badRequest,
  created,
  internalServerErrorCode,
} from "../../../shared/constants/http-code-constants";
import { unexpectedError } from "../../../shared/constants/message-constants";
import {
  GenericError,
  GenericSuccess,
  Result,
} from "../../../shared/types/types";
import { UserModel } from "../infra/persistance/user-model";

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

    return { kind: "success", value: { code: created, token } };
  } catch (err: any) {
    errorLogger("Error trying to create a new user", err);

    if (isDuplicateKeyError(err)) {
      return {
        kind: "error",
        error: { code: badRequest, msg: "Email/username already in use" },
      };
    }

    return {
      kind: "error",
      error: { code: internalServerErrorCode, msg: unexpectedError },
    };
  }
};
