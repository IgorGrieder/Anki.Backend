import { Account } from "../../domain/account/account-type";
import { saltRounds } from "../../shared/constants/jwt-constants";
import bcrypt from "bcrypt";

export const hashPassword = async (account: Account): Promise<Account> => {
  try {
    const hashedPassword = await bcrypt.hash(account.password, saltRounds);
    return { ...account, password: hashedPassword };
  } catch (error) {
    console.log('Hashing error');
    throw error;
  }
}
