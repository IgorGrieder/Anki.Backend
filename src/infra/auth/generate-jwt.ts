import { AccountMongoDocument } from "../../domain/account/account-type";
import jsonwebtoken from "jsonwebtoken";
import { expiresIn } from "../../shared/constants/jwt-constants";

export const generateJWT = (account: AccountMongoDocument): string => {
  const payload = {
    userId: account._id,
    username: account.username,
    email: account.email,
  };

  const jwtSecret = process.env.SECRET_KEY_JWT ?? '';
  return jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn,
  });
}

