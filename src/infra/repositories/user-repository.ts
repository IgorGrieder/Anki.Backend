import { UserModel } from "../../domain/user/user-model";
import { userDocumentSchema } from "../../domain/user/user-schemas";
import { CreateUserInput, UserDocument } from "../../domain/user/user-types";
import { ZodDBValidationError } from "../../shared/errors/zod-db-validation-error";

export const createUser = async (
  user: CreateUserInput
): Promise<UserDocument> => {
  const data = await UserModel.create(user);
  const result = userDocumentSchema.safeParse(data);

  if (!result.success) {
    throw new ZodDBValidationError<UserDocument>(result);
  }

  return data;
};

export const findAccountById = async (
  id: string
): Promise<UserDocument | null> => {
  const data = await UserModel.findById(id).lean();

  if (!data) {
    return null;
  }

  const result = userDocumentSchema.safeParse(data);

  if (!result.success) {
    throw new ZodDBValidationError<UserDocument>(result);
  }

  return result.data;
};
