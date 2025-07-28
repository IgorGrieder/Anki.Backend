import { IUserController } from "../port/driving/user-controller";
import { CreateUserDto } from "./use-cases/dtos/create-user-dto";
import { LoginUserDto } from "./use-cases/dtos/login-user-dto";
import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../shared/types/types";

interface Success extends GenericSuccess {
  token: string;
}

// Type for the use case functions
type CreateUserUseCase = (
  user: CreateUserDto
) => Promise<Result<Success, GenericError>>;
type LoginUserUseCase = (
  user: LoginUserDto
) => Promise<Result<Success, GenericError>>;

export const createUserController = (
  createUserUseCase: CreateUserUseCase,
  loginUserUseCase: LoginUserUseCase
): IUserController => {
  return {
    async createUser(
      user: CreateUserDto
    ): Promise<Result<Success, GenericError>> {
      return createUserUseCase(user);
    },

    async loginUser(
      user: LoginUserDto
    ): Promise<Result<Success, GenericError>> {
      return loginUserUseCase(user);
    },
  };
};
