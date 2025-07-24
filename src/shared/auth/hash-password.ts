import { CreateUserDto } from "../../features/users/application/dtos/create-user-dto";
import { jwtConstants } from "../constants/constants-module";
import bcrypt from "bcrypt";

const hashPassword = async (user: CreateUserDto): Promise<CreateUserDto> => {
  try {
    if (!user.password) {
      throw new Error("Password is not provided, cannot hash.");
    }

    const hashedPassword = await bcrypt.hash(
      user.password,
      jwtConstants.saltRounds
    );
    return { ...user, password: hashedPassword };
  } catch (error) {
    throw error;
  }
};

export { hashPassword };
