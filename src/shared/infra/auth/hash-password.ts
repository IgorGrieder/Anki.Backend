import { CreateUserDto } from "../../../features/users/application/dtos/create-user-dto";
import { saltRounds } from "../../constants/jwt-constants";
import bcrypt from "bcrypt";

export const hashPassword = async (
  user: CreateUserDto
): Promise<CreateUserDto> => {
  try {
    if (!user.password) {
      throw new Error("Password is not provided, cannot hash.");
    }

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    return { ...user, password: hashedPassword };
  } catch (error) {
    throw error;
  }
};
