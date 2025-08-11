import { Router } from "express";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import { validateJWTMiddlewear } from "../../../shared/middlewares/jwt-middleware";
import * as Schemas from "./user-inputs";
import * as Handlers from "./user-handlers";
import { upload } from "../../../shared/infra/upload/multer";

export const createCollectionRouter = () => {
  const router = Router();
  const path = "/collections";

  router.get(`${path}/get-collections`, validateJWTMiddlewear, Handlers.getCollectionsHandler);

  router.post(
    `${path}/create-collection`,
    validateJWTMiddlewear,
    genericBodyValidator(Schemas.createCollectionSchema),
    Handlers.createCollectionHandler
  );

  router.post(
    `${path}/delete-collection`,
    validateJWTMiddlewear,
    genericBodyValidator(Schemas.deleteCollectionSchema),
    Handlers.deleteCollectionHandler
  );

  // Cards
  router.post(
    `${path}/add-card`,
    validateJWTMiddlewear,
    upload.single("file"),
    genericBodyValidator(Schemas.addCardSchema),
    Handlers.addCardHandler
  );

  router.patch(
    `${path}/update-card`,
    validateJWTMiddlewear,
    upload.single("file"),
    genericBodyValidator(Schemas.updateCardSchema),
    Handlers.updateCardHandler
  );

  router.patch(
    `${path}/delete-card`,
    validateJWTMiddlewear,
    genericBodyValidator(Schemas.deleteCardSchema),
    Handlers.deleteCardHandler
  );

  // Images
  router.get(`${path}/image/:imageId`, Handlers.streamImageHandler);

  return router;
};
