import { userDocumentSchema } from "../../domain/user/user-schemas";
import { CreateUserInput } from "../../domain/user/user-types";
import { generateJWT } from "../../infra/auth/generate-jwt";
import { hashPassword } from "../../infra/auth/hash-password";
import { isDuplicateKeyError } from "../../infra/db/mongo/mongo-errors";
import { errorLogger } from "../../infra/logger/error-logger";
import { createUser } from "../../infra/repositories/user-repository";
import { validateWithSchema } from "../../infra/validator/generic-schema-validator";
import {
  badRequest,
  created,
  internalServerErrorCode,
} from "../../shared/constants/http-code-constants";
import { unexpectedError } from "../../shared/constants/message-constants";
import { GenericError, GenericSuccess, Result } from "../../shared/types/types";

interface Success extends GenericSuccess {
  token: string;
}

export const createNewAccount = async (
  user: CreateUserInput
): Promise<Result<Success, GenericError>> => {
  try {
    const userPassHashed = await hashPassword(user);
    const createdUser = await createUser(userPassHashed);
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
