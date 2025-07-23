import { CreateUserInput } from "../../domain/user/user-types";
import { saltRounds } from "../../shared/constants/jwt-constants";
import bcrypt from "bcrypt";

export const hashPassword = async (
  user: CreateUserInput
): Promise<CreateUserInput> => {
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
