import { httpCodes, resMessages } from "../../../../shared/constants/constants-module";
import { Result, GenericError, GenericSuccess } from "../../../../shared/types/types";
import * as Repo from "../../data-access/collection-repository";

export const deleteCard = async (params: {
  collectionId: string;
  cardId: string;
}): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    const updated = await Repo.deleteCardFromCollection(params);
    if (!updated) {
      return { kind: "error", error: { code: httpCodes.badRequest, msg: resMessages.collectionNotFound } };
    }
    return { kind: "success", value: { code: httpCodes.noContent } };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
