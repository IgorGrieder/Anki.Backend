import { Account } from "../../domain/account/account-type";
import { generateJWT } from "../../infra/auth/generate-jwt";
import { hashPassword } from "../../infra/auth/hash-password";
import { isDuplicateKeyError } from "../../infra/db/mongo/mongo-errors";
import { createAccount } from "../../infra/repositories/account-repository";
import { badRequest, created, internalServerErrorCode } from "../../shared/constants/http-code-constants";
import { unexpectedError } from "../../shared/constants/message-constants";
import { Result } from "../../shared/types/types";

type success = { code: number; token: string };
type error = { code: number; msg: string };

export const createNewAccount = async (account: Account): Promise<Result<success, error>> => {
  try {
    const accountPassHashed = await hashPassword(account);
    const createdAccount = await createAccount(accountPassHashed);
    const token = generateJWT(createdAccount);

    return { kind: 'success', value: { code: created, token } };

  } catch (err: any) {
    if (isDuplicateKeyError(err)) {
      return { kind: 'error', error: { code: badRequest, msg: "Email already in use" } }
    }

    console.error(err);
    return { kind: 'error', error: { code: internalServerErrorCode, msg: unexpectedError } }
  }
}
