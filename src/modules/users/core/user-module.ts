import { createUserUseCase } from "./use-cases/create-user";
import { loginUserUseCase } from "./use-cases/login-user";
import { createUserRepository } from "../adapter/driven/user-repositoy";
import { createUserController } from "./user-controller";
import { IUserRepository } from "../port/driven/user-repository";
import { IUserController } from "../port/driving/user-controller";

const userRepository: IUserRepository = createUserRepository();

// Create use cases with dependencies
const createUser = createUserUseCase(userRepository);
const loginUser = loginUserUseCase(userRepository);

// Create controller with use cases injected
const userController: IUserController = createUserController(
  createUser,
  loginUser
);

export const UserUseCases = {
  createUser,
  loginUser,
};

export const UserController = userController;

// Export the repository for testing or other uses
export const getUserRepository = (): IUserRepository => userRepository;
