import { httpCodes } from "../../../shared/constants/http-code-constants";
import { resMessages } from "../../../shared/constants/message-constants";
import {
  GenericError,
  GenericSuccess,
  Result,
} from "../../../shared/types/types";
import { DeleteUserInput } from "../common/user-types";
import { deleteUserById } from "../data-access/user-repository";

export const deleteUser = async (
  user: DeleteUserInput
): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    await deleteUserById(user);
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
