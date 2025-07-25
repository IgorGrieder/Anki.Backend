import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { Result } from "../../types/types";
import {
  errorToken,
  expiredToken,
  unauthorizedMessage,
  unexpectedError,
} from "../../constants/message-constants";
import {
  internalServerErrorCode,
  unauthorizedCode,
} from "../../constants/http-code-constants";

type success = { decoded: JwtPayload };
type error = { code: number; message: string };

const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as JwtPayload);
    });
  });
};

export const validateJWT = async (
  token: string
): Promise<Result<success, error>> => {
  try {
    const secret = process.env.SECRET_KEY_JWT;
    if (!secret) {
      return {
        kind: "error",
        error: { code: internalServerErrorCode, message: unexpectedError },
      };
    }

    const decoded = await verifyToken(token, secret);
    return { kind: "success", value: { decoded } };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return {
        kind: "error",
        error: { code: unauthorizedCode, message: expiredToken },
      };
    }
    if (err.name === "JsonWebTokenError") {
      return {
        kind: "error",
        error: { code: unauthorizedCode, message: errorToken },
      };
    }
    return {
      kind: "error",
      error: { code: internalServerErrorCode, message: unauthorizedMessage },
    };
  }
};
