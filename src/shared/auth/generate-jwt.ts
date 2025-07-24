import jsonwebtoken from "jsonwebtoken";
import { expiresIn } from "../constants/jwt-constants";
import { UserDocument } from "../../features/users/domain/user-types";

const generateJWT = (user: UserDocument): string => {
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

export { generateJWT };
