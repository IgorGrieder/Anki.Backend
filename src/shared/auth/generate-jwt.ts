import jsonwebtoken from "jsonwebtoken";
import { User } from "../../modules/users/core/user-entity";
import { jwtConstants } from "../constants/constants-module";

const generateJWT = (user: User): string => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };

  const jwtSecret = process.env.SECRET_KEY_JWT;
  if (!jwtSecret) throw Error("No JWT secret provided");

  return jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn: jwtConstants.expiresIn as string,
  });
};

export { generateJWT };
