import { CreateUserDto } from "../../core/use-cases/dtos/create-user-dto";
import { User } from "../../core/user-entity";
import { IUserRepository } from "../../port/driven/user-repository";
import { UserModel } from "./mongoose/user-model";

export const createUserRepository = (): IUserRepository => {
  return {
    async createUser(user: CreateUserDto): Promise<User | null> {
      return UserModel.create(user);
    },
  };
};
