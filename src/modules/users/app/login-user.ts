import { IUserRepository } from "../port/driven/user-repository";
import { LoginUserDto } from "../core/use-cases/dtos/login-user-dto";
import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../shared/types/types";
import { generateJWT } from "../../../shared/auth/generate-jwt";
import { validateWithSchema } from "../../../shared/utils/generic-schema-validator";
import { userDocumentSchema, User } from "../core/user-entity";
import logger from "../../../shared/logger/logger-module";
import {
  httpCodes,
  resMessages,
} from "../../../shared/constants/constants-module";
import bcrypt from "bcryptjs";

interface Success extends GenericSuccess {
  token: string;
}

export const loginUserUseCase =
  (userRepository: IUserRepository) =>
  async (user: LoginUserDto): Promise<Result<Success, GenericError>> => {
    try {
      const result = await userRepository.findByEmailOrUsername(user.login);

      if (!result) {
        return {
          kind: "error",
          error: { code: httpCodes.notFound, msg: resMessages.userNotFound },
        };
      }

      if (!result.password_hash) {
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
        result.password_hash
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

      // Update last login
      await userRepository.updateLastLogin(result._id);

      const data = validateWithSchema<User>(userDocumentSchema, result);
      const token = generateJWT(data);

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
