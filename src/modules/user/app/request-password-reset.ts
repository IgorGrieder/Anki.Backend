import {
  Result,
  GenericError,
  GenericSuccess,
} from "../../../shared/types/types";
import {
  httpCodes,
  resMessages,
} from "../../../shared/constants/constants-module";
import { RequestPasswordResetInput } from "../common/user-types";
import { UserModel } from "../data-access/user-model";
import crypto from "crypto";
import { saveResetCode } from "../../../shared/infra/redis/password-reset";
import { addEmailJob } from "../../../shared/infra/queue/mail-queue";
import { config } from "../../../shared/config/env/env-config";

const RESET_CODE_TTL_SECONDS = 15 * 60; // 15 minutes

export const requestPasswordReset = async (
  input: RequestPasswordResetInput
): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) {
      return { kind: "success", value: { code: httpCodes.noContent } };
    }

    const code = crypto.randomInt(100000, 999999).toString();
    await saveResetCode(code, user._id.toString(), RESET_CODE_TTL_SECONDS);

    const resetUrl = `${config.FRONTEND_URL}/reset-password?code=${encodeURIComponent(code)}`;

    await addEmailJob({
      to: input.email,
      subject: "Reset your password",
      html: `<p>Use this code to reset your password: <b>${code}</b></p><p>Or click the link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return { kind: "success", value: { code: httpCodes.noContent } };
  } catch (err: any) {
    return {
      kind: "error",
      error: {
        code: httpCodes.internalServerError,
        msg: resMessages.unexpectedError,
      },
    };
  }
};
