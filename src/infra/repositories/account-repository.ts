import { AccountModel } from "../../domain/account/account-model";
import { Account, AccountMongoDocument } from "../../domain/account/account-type";

export const createAccount = async (account: Account): Promise<AccountMongoDocument> => {
  return await AccountModel.create(account);
}

export const findAccountById = async (id: string): Promise<AccountMongoDocument | null> => {
  return await AccountModel.findById(id).lean();
}
