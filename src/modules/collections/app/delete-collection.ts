import { httpCodes, resMessages } from "../../../shared/constants/constants-module";
import { Result, GenericError, GenericSuccess } from "../../../shared/types/types";
import * as Repo from "../data-access/collection-repository";

export const deleteCollection = async (
  collectionId: string
): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    const ok = await Repo.deleteCollectionById(collectionId);
    if (!ok) {
      return {
        kind: "error",
        error: { code: httpCodes.badRequest, msg: resMessages.collectionNotFound },
      };
    }
    return { kind: "success", value: { code: httpCodes.noContent } };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
