import { UserDocument } from "../../domain/user/user-types";
import jsonwebtoken from "jsonwebtoken";
import { expiresIn } from "../../shared/constants/jwt-constants";

export const generateJWT = (user: UserDocument): string => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };

  const jwtSecret = process.env.SECRET_KEY_JWT;
  if (!jwtSecret) throw Error("No JWT secret provided");
  return jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn,
  });
};
