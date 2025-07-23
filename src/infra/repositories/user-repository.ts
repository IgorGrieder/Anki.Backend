import { UserModel } from "../../domain/user/user-model";
import { CreateUserInput, UserDocument } from "../../domain/user/user-types";

export const createUser = async (
  user: CreateUserInput
): Promise<UserDocument> => {
  return await UserModel.create(user);
};

export const findAccountById = async (
  id: string
): Promise<UserDocument | null> => {
  return await UserModel.findById(id).lean();
};
