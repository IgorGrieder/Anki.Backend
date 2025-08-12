import { Result, GenericError, GenericSuccess } from "../../../shared/types/types";
import { httpCodes, resMessages } from "../../../shared/constants/constants-module";
import { PerformPasswordResetInput } from "../common/user-types";
import { getUserIdByResetCode, deleteResetCode } from "../../../shared/infra/redis/password-reset";
import { UserModel } from "../data-access/user-model";
import { hashPassword } from "../../../shared/auth/hash-password";

export const performPasswordReset = async (
  input: PerformPasswordResetInput
): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    const userId = await getUserIdByResetCode(input.code);
    if (!userId) {
      return { kind: "error", error: { code: httpCodes.badRequest, msg: resMessages.invalidToken } };
    }

    const updatedUser = await UserModel.findById(userId);
    if (!updatedUser) {
      return { kind: "error", error: { code: httpCodes.notFound, msg: resMessages.userNotFound } };
    }

    const hashed = await hashPassword({ password: input.password });

    await UserModel.updateOne({ _id: userId }, { $set: { password_hash: hashed.password } });

    await deleteResetCode(input.code);

    return { kind: "success", value: { code: httpCodes.noContent } };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
