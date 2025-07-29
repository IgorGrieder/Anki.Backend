import { IUserRepository } from "../port/driven/user-repository";
import { CreateUserDto } from "../core/use-cases/dtos/create-user-dto";
import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../shared/types/types";
import { hashPassword } from "../../../shared/auth/hash-password";
import { generateJWT } from "../../../shared/auth/generate-jwt";
import { validateWithSchema } from "../../../shared/utils/generic-schema-validator";
import { userDocumentSchema, User } from "../core/user-entity";
import logger from "../../../shared/logger/logger-module";
import {
  httpCodes,
  resMessages,
} from "../../../shared/constants/constants-module";
import { isDuplicateKeyError } from "../../../shared/utils/helpers";

interface Success extends GenericSuccess {
  token: string;
}

export const createUserUseCase =
  (userRepository: IUserRepository) =>
  async (user: CreateUserDto): Promise<Result<Success, GenericError>> => {
    try {
      const userPassHashed = await hashPassword(user);
      const createdUser = await userRepository.createUser(userPassHashed);

      if (!createdUser) {
        return {
          kind: "error",
          error: {
            code: httpCodes.internalServerError,
            msg: resMessages.unexpectedError,
          },
        };
      }

      const data = validateWithSchema<User>(userDocumentSchema, createdUser);
      const token = generateJWT(data);

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
