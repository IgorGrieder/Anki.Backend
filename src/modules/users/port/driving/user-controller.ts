import { CreateUserDto } from "../../core/use-cases/dtos/create-user-dto";
import { LoginUserDto } from "../../core/use-cases/dtos/login-user-dto";
import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../../shared/types/types";

interface Success extends GenericSuccess {
  token: string;
}

export interface IUserController {
  createUser(user: CreateUserDto): Promise<Result<Success, GenericError>>;
  loginUser(user: LoginUserDto): Promise<Result<Success, GenericError>>;
}
