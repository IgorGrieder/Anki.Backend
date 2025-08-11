import { httpCodes, resMessages } from "../../../../shared/constants/constants-module";
import { Result, GenericError, GenericSuccess } from "../../../../shared/types/types";
import * as Repo from "../../data-access/collection-repository";

export const updateCard = async (params: {
  collectionId: string;
  cardId: string;
  card: { topic: string; answer: string; question: string };
}): Promise<Result<GenericSuccess, GenericError>> => {
  try {
    const updated = await Repo.updateCard(params);
    if (!updated) {
      return { kind: "error", error: { code: httpCodes.notFound, msg: resMessages.collectionNotFound } };
    }
    return { kind: "success", value: { code: httpCodes.noContent } };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
