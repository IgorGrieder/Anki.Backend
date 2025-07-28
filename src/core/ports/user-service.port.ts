import { User } from "../entities/user.entity";

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UserServicePort {
  createUser(request: CreateUserRequest): Promise<User>;
  loginUser(request: LoginUserRequest): Promise<{ user: User; token: string }>;
  getUserById(id: string): Promise<User | null>;
  updateUser(
    id: string,
    updates: Partial<CreateUserRequest>
  ): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
