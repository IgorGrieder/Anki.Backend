import {
  GenericError,
  GenericSuccess,
  Result,
} from "../../../shared/types/types";
import { PasswordChangeInput } from "../common/user-types";

export const changeUserPassword = async (
  userPasswordChange: PasswordChangeInput
): Promise<Result<GenericSuccess, GenericError>> => {
  return { kind: "success", value: { code: 204 } };
};
