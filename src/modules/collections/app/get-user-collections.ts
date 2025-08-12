import { httpCodes, resMessages } from "../../../shared/constants/constants-module";
import { Result, GenericError } from "../../../shared/types/types";
import * as Repo from "../data-access/collection-repository";
import { CollectionDocument } from "../common/collection-types";

export const getUserCollections = async (
  userId: string
): Promise<Result<{ code: number; collections: CollectionDocument[] }, GenericError>> => {
  try {
    const collections = await Repo.getUserCollections(userId);
    if (!collections.length) {
      return { kind: "success", value: { code: httpCodes.noContent, collections: [] } };
    }
    return { kind: "success", value: { code: httpCodes.ok, collections } };
  } catch (err) {
    return {
      kind: "error",
      error: { code: httpCodes.internalServerError, msg: resMessages.unexpectedError },
    };
  }
};
