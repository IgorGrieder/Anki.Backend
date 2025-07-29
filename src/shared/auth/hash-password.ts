import { CreateUserInput } from "../../modules/user/common/user-types";
import { jwtConstants } from "../constants/constants-module";
import bcrypt from "bcrypt";

const hashPassword = async (
  user: CreateUserInput
): Promise<CreateUserInput> => {
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
