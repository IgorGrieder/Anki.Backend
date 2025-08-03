import {
  CreateUserInput,
  DeleteUserInput,
  LoginUserInput,
  UserDocument,
} from "../common/user-types";
import { UserModel } from "./collection-model";

export const updateLastLogin = async (user: UserDocument) => {
  await UserModel.findByIdAndUpdate(user._id, {
    last_login_at: new Date(),
  });
};

export const createNewUser = async (
  user: CreateUserInput
): Promise<UserDocument> => {
  return await UserModel.create(user);
};

export const findUserByLogin = async (
  user: LoginUserInput
): Promise<UserDocument | null> => {
  return await UserModel.findOne({
    $or: [{ email: user.login }, { username: user.login }],
  });
};

export const deleteUserById = async (user: DeleteUserInput) => {
  await UserModel.findByIdAndUpdate(user.id, { is_active: false });
};
