import { AccountModel } from "../../domain/account/account-model";
import { Account } from "../../domain/account/account-type";

export const createAccount = async (user: Account) => {
  await AccountModel.create(user);
};

export const findAccountById = async (id: string): Promise<Account | null> => {
  return await AccountModel.findById(id).lean();
};
