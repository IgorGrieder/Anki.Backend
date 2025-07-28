import { CreateUserDto } from "../../core/use-cases/dtos/create-user-dto";
import { User } from "../../core/user-entity";

export interface IUserRepository {
  createUser(user: CreateUserDto): Promise<User | null>;
}
