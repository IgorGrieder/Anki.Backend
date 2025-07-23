import { userDocumentSchema } from "../infra/persistance/user-schemas";
import { CreateUserInput } from "./dtos/create-user-dto";
import { generateJWT } from "../../../shared/infra/auth/generate-jwt";
import { hashPassword } from "../../../shared/infra/auth/hash-password";
import { isDuplicateKeyError } from "../../../shared/infra/persistance/mongo/mongo-errors";
import { errorLogger } from "../../../shared/infra/logger/error-logger";
import { validateWithSchema } from "../../../shared/infra/persistance/validators/generic-schema-validator";
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
  user: CreateUserInput
): Promise<Result<Success, GenericError>> => {
  try {
    const userPassHashed = await hashPassword(user);
    const createdUser = await UserModel.create(userPassHashed);
    const data = validateWithSchema(userDocumentSchema, createdUser);
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
