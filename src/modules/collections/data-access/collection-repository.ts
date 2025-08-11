import { ObjectId } from "mongodb";
import { CollectionModel } from "./collection-model";
import { CollectionDocument } from "../common/collection-types";

export const getUserCollections = async (
  userId: string
): Promise<CollectionDocument[]> => {
  return await CollectionModel.find({ owner: new ObjectId(userId) });
};

export const createCollection = async (params: {
  userId: string;
  name: string;
  category: string;
}): Promise<CollectionDocument> => {
  return await CollectionModel.create({
    name: params.name,
    owner: new ObjectId(params.userId),
    category: params.category,
    cards: [],
  } as any);
};

export const deleteCollectionById = async (
  collectionId: string
): Promise<boolean> => {
  const res = await CollectionModel.deleteOne({ _id: new ObjectId(collectionId) });
  return res.deletedCount === 1;
};

export const addCardToCollection = async (params: {
  collectionId: string;
  card: { question: string; answer: string; topic: string; _id?: any };
}) => {
  const res = await CollectionModel.findOneAndUpdate(
    { _id: new ObjectId(params.collectionId) },
    { $push: { cards: params.card } },
    { returnDocument: "after" }
  );
  return res;
};

export const findCollectionCard = async (params: {
  collectionId: string;
  cardId: string;
}) => {
  const collection = await CollectionModel.findOne({
    _id: new ObjectId(params.collectionId),
    "cards._id": new ObjectId(params.cardId),
  });
  return collection;
};

export const updateCard = async (params: {
  collectionId: string;
  cardId: string;
  card: { topic: string; answer: string; question: string };
}) => {
  const res = await CollectionModel.findOneAndUpdate(
    { _id: new ObjectId(params.collectionId), "cards._id": new ObjectId(params.cardId) },
    {
      $set: {
        "cards.$.topic": params.card.topic,
        "cards.$.answer": params.card.answer,
        "cards.$.question": params.card.question,
      },
    },
    { returnDocument: "after" }
  );
  return res;
};

export const deleteCardFromCollection = async (params: {
  collectionId: string;
  cardId: string;
}) => {
  const res = await CollectionModel.findOneAndUpdate(
    { _id: new ObjectId(params.collectionId) },
    { $pull: { cards: { _id: new ObjectId(params.cardId) } } },
    { returnDocument: "after" }
  );
  return res;
};
