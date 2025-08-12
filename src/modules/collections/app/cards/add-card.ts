import { httpCodes, resMessages } from "../../../../shared/constants/constants-module";
import { Result, GenericError, GenericSuccess } from "../../../../shared/types/types";
import * as Repo from "../../data-access/collection-repository";

export const addCard = async (params: {
  collectionId: string;
  card: { question: string; answer: string; topic: string; _id?: any };
}): Promise<Result<GenericSuccess & { newCardId: string }, GenericError>> => {
  try {
    const updated = await Repo.addCardToCollection(params);
    if (!updated) {
      return { kind: "error", error: { code: httpCodes.badRequest, msg: resMessages.collectionNotFound } };
    }
    return {
      kind: "success",
      value: { code: httpCodes.created, newCardId: (params.card._id ?? "").toString() },
    };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
