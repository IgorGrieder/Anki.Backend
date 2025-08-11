import { Request, Response } from "express";
import { httpCodes, resMessages } from "../../../shared/constants/constants-module";
import { getUserCollections } from "../app/get-user-collections";
import { createCollection } from "../app/create-collection";
import { deleteCollection } from "../app/delete-collection";
import { addCard } from "../app/cards/add-card";
import { updateCard } from "../app/cards/update-card";
import { deleteCard } from "../app/cards/delete-card";
import { uploadImage, deleteImage, getImageStream } from "../app/cards/image-service";
import { ObjectId } from "mongodb";

export const getCollectionsHandler = async (req: Request, res: Response) => {
  const userId: string = req.body.jwt?.userId;
  const result = await getUserCollections(userId);
  if (result.kind === "success") {
    if (result.value.code === httpCodes.noContent) {
      res.status(httpCodes.noContent).send();
      return;
    }
    res.status(result.value.code).json({ collectionsFound: true, collections: result.value.collections });
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const createCollectionHandler = async (req: Request, res: Response) => {
  const userId: string = req.body.jwt?.userId;
  const { name, category } = req.body.validated as { name: string; category: string };
  const result = await createCollection({ userId, name, category });
  if (result.kind === "success") {
    res.status(result.value.code).json({
      collectionCreated: true,
      message: resMessages.collectionCreated,
      collectionId: result.value.collectionId,
    });
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const deleteCollectionHandler = async (req: Request, res: Response) => {
  const { collectionId } = req.body.validated as { collectionId: string };
  const result = await deleteCollection(collectionId);
  if (result.kind === "success") {
    res.status(result.value.code).send();
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const addCardHandler = async (req: Request, res: Response) => {
  const { question, answer, topic, collectionId } = req.body.validated as {
    question: string;
    answer: string;
    topic: string;
    collectionId: string;
  };

  const newCardId = new ObjectId().toString();

  if (req.file) {
    const uploaded = await uploadImage(req.file, newCardId);
    if (!uploaded) {
      res.status(httpCodes.internalServerError).json({ cardAdded: false, message: resMessages.unexpectedError });
      return;
    }
  }

  const result = await addCard({ collectionId, card: { question, answer, topic, _id: new ObjectId(newCardId) } });
  if (result.kind === "success") {
    res.status(result.value.code).json({ cardAdded: true, message: resMessages.cardAdded, newCard: result.value.newCardId });
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const updateCardHandler = async (req: Request, res: Response) => {
  const { collectionId, cardId, topic, answer, question, hasNewImage } = req.body.validated as {
    collectionId: string;
    cardId: string;
    topic: string;
    answer: string;
    question: string;
    hasNewImage?: boolean;
  };

  if (hasNewImage && req.file) {
    await deleteImage(cardId);
    const uploaded = await uploadImage(req.file, cardId);
    if (!uploaded) {
      res.status(httpCodes.internalServerError).json({ cardUpdated: false, message: resMessages.unexpectedError });
      return;
    }
  }

  const result = await updateCard({ collectionId, cardId, card: { topic, answer, question } });
  if (result.kind === "success") {
    res.status(result.value.code).send();
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const deleteCardHandler = async (req: Request, res: Response) => {
  const { collectionId, cardId } = req.body.validated as { collectionId: string; cardId: string };

  await deleteImage(cardId);

  const result = await deleteCard({ collectionId, cardId });
  if (result.kind === "success") {
    res.status(result.value.code).send();
    return;
  }
  res.status(result.error.code).json({ message: result.error.msg });
};

export const streamAllImagesHandler = async (req: Request, res: Response) => {
  // Placeholder for future bulk image retrieval if needed
  res.status(httpCodes.notFound).json({ message: resMessages.collectionNotFound });
};

export const streamImageHandler = async (req: Request, res: Response) => {
  const imageId = req.params.imageId;
  const result = await getImageStream(imageId);
  if (!result || !result.stream) {
    res.status(httpCodes.notFound).json({ error: "Image not found" });
    return;
  }
  if (result.contentType) res.setHeader("Content-Type", result.contentType);
  if (result.contentLength) res.setHeader("Content-Length", String(result.contentLength));
  (result.stream as any).pipe(res);
};
