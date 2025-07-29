import { User } from "../../core/entities/user.entity";
import {
  UserServicePort,
  CreateUserRequest,
  LoginUserRequest,
} from "../../core/ports/user-service.port";
import { CreateUserUseCase } from "../../core/use-cases/create-user.use-case";
import { LoginUserUseCase } from "../../core/use-cases/login-user.use-case";
import { GetUserUseCase } from "../../core/use-cases/get-user.use-case";
import {
  UpdateUserUseCase,
  UpdateUserRequest,
} from "../../core/use-cases/update-user.use-case";
import { DeleteUserUseCase } from "../../core/use-cases/delete-user.use-case";
import { UserRepositoryPort } from "../../core/ports/user-repository.port";

export class UserService implements UserServicePort {
  private readonly createUserUseCase: CreateUserUseCase;
  private readonly loginUserUseCase: LoginUserUseCase;
  private readonly getUserUseCase: GetUserUseCase;
  private readonly updateUserUseCase: UpdateUserUseCase;
  private readonly deleteUserUseCase: DeleteUserUseCase;

  constructor(userRepository: UserRepositoryPort) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.loginUserUseCase = new LoginUserUseCase(userRepository);
    this.getUserUseCase = new GetUserUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    return this.createUserUseCase.execute(request);
  }

  async loginUser(
    request: LoginUserRequest
  ): Promise<{ user: User; token: string }> {
    return this.loginUserUseCase.execute(request);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.getUserUseCase.execute(id);
  }

  async updateUser(
    id: string,
    updates: Partial<CreateUserRequest>
  ): Promise<User | null> {
    const updateRequest: UpdateUserRequest = {
      name: updates.name,
      email: updates.email,
      password: updates.password,
    };
    return this.updateUserUseCase.execute(id, updateRequest);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.deleteUserUseCase.execute(id);
  }
}
