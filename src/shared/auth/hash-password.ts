import { jwtConstants } from "../constants/constants-module";
import bcrypt from "bcrypt";

const hashPassword = async <T extends { password: string }>(
  user: T
): Promise<T> => {
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
