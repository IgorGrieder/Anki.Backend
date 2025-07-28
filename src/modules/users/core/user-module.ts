import { createUserUseCase } from "./use-cases/create-user";
import { loginUserUseCase } from "./use-cases/login-user";
import { createUserRepository } from "../adapter/driven/user-repositoy";
import { IUserRepository } from "../port/driven/user-repository";

const userRepository: IUserRepository = createUserRepository();

export const UserUseCases = {
  createUser: createUserUseCase(userRepository),
  loginUser: loginUserUseCase(userRepository),
};

// Export the repository for testing or other uses
export const getUserRepository = (): IUserRepository => userRepository;
