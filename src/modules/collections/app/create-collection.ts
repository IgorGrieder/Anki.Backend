import { httpCodes, resMessages } from "../../../shared/constants/constants-module";
import { Result, GenericError, GenericSuccess } from "../../../shared/types/types";
import * as Repo from "../data-access/collection-repository";

export const createCollection = async (params: {
  userId: string;
  name: string;
  category: string;
}): Promise<Result<GenericSuccess & { collectionId: string }, GenericError>> => {
  try {
    const created = await Repo.createCollection(params);
    return {
      kind: "success",
      value: { code: httpCodes.created, collectionId: created._id.toString() },
    };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
