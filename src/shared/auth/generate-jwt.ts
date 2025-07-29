import jsonwebtoken from "jsonwebtoken";
import { jwtConstants } from "../constants/constants-module";
import { UserDocument } from "../../modules/user/common/user-types";

const generateJWT = (user: UserDocument): string => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
  };

  const jwtSecret = process.env.SECRET_KEY_JWT;
  if (!jwtSecret) throw Error("No JWT secret provided");

  return jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn: jwtConstants.expiresIn,
  });
};

export { generateJWT };
