import { CreateUserDto } from "../../core/use-cases/dtos/create-user-dto";
import { LoginUserDto } from "../../core/use-cases/dtos/login-user-dto";
import { User } from "../../core/user-entity";

export interface IUserRepository {
  createUser(user: CreateUserDto): Promise<User | null>;
  findByEmailOrUsername(login: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateLastLogin(userId: string): Promise<void>;
  updateUser(userId: string, updates: Partial<User>): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
}
