import { CreateUserInput, LoginUserInput } from "../presentation/user-inputs";
import { UserDocument } from "../user-types";
import { UserModel } from "./user-model";

export const updateLastLogin = async (user: UserDocument) => {
  await UserModel.findByIdAndUpdate(user._id, {
    last_login_at: new Date(),
  });
};

export const createNewUser = async (
  user: CreateUserInput
): Promise<UserDocument | null> => {
  return await UserModel.create(user);
};

export const findUserByLogin = async (
  user: LoginUserInput
): Promise<UserDocument | null> => {
  return await UserModel.findOne({
    $or: [{ email: user.login }, { username: user.login }],
  });
};
