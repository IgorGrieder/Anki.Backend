import { Router } from "express";
import { genericBodyValidator } from "../../../shared/middlewares/generic-validator";
import { validateJWTMiddlewear } from "../../../shared/middlewares/jwt-middleware";
import * as Schemas from "./user-inputs";
import * as Handlers from "./user-handlers";
import { upload } from "../../../shared/infra/upload/multer";

export const createCollectionRouter = () => {
  const router = Router();
  const path = "/collections";

  /**
   * @openapi
   * /api/collections/get-collections:
   *   get:
   *     tags:
   *       - Collections
   *     summary: List user collections
   *     description: Returns all collections for the authenticated user. Returns 204 when none exist.
   *     responses:
   *       '200':
   *         description: Collections found
   *       '204':
   *         description: No collections for this user
   *       '401':
   *         description: Unauthorized
   */
  router.get(`${path}/get-collections`, validateJWTMiddlewear, Handlers.getCollectionsHandler);

  /**
   * @openapi
   * /api/collections/create-collection:
   *   post:
   *     tags:
   *       - Collections
   *     summary: Create a collection
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCollection'
   *     responses:
   *       '201':
   *         description: Collection created
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   */
  router.post(`${path}/create-collection`, validateJWTMiddlewear, genericBodyValidator(Schemas.createCollectionSchema), Handlers.createCollectionHandler);

  /**
   * @openapi
   * /api/collections/delete-collection:
   *   post:
   *     tags:
   *       - Collections
   *     summary: Delete a collection
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               collectionId:
   *                 type: string
   *     responses:
   *       '204':
   *         description: Deleted
   *       '400':
   *         description: Invalid request
   *       '401':
   *         description: Unauthorized
   */
  router.post(`${path}/delete-collection`, validateJWTMiddlewear, genericBodyValidator(Schemas.deleteCollectionSchema), Handlers.deleteCollectionHandler);

  // Cards
  /**
   * @openapi
   * /api/collections/add-card:
   *   post:
   *     tags:
   *       - Cards
   *     summary: Add a card to a collection
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               collectionId:
   *                 type: string
   *               question:
   *                 type: string
   *               answer:
   *                 type: string
   *               topic:
   *                 type: string
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       '201':
   *         description: Card added
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   */
  router.post(`${path}/add-card`, validateJWTMiddlewear, upload.single("file"), genericBodyValidator(Schemas.addCardSchema), Handlers.addCardHandler);

  /**
   * @openapi
   * /api/collections/update-card:
   *   patch:
   *     tags:
   *       - Cards
   *     summary: Update a card
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               collectionId:
   *                 type: string
   *               cardId:
   *                 type: string
   *               topic:
   *                 type: string
   *               answer:
   *                 type: string
   *               question:
   *                 type: string
   *               hasNewImage:
   *                 type: boolean
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       '204':
   *         description: Updated
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   */
  router.patch(`${path}/update-card`, validateJWTMiddlewear, upload.single("file"), genericBodyValidator(Schemas.updateCardSchema), Handlers.updateCardHandler);

  /**
   * @openapi
   * /api/collections/delete-card:
   *   patch:
   *     tags:
   *       - Cards
   *     summary: Delete a card from a collection
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               collectionId:
   *                 type: string
   *               cardId:
   *                 type: string
   *     responses:
   *       '204':
   *         description: Deleted
   *       '400':
   *         description: Validation error
   *       '401':
   *         description: Unauthorized
   */
  router.patch(`${path}/delete-card`, validateJWTMiddlewear, genericBodyValidator(Schemas.deleteCardSchema), Handlers.deleteCardHandler);

  // Images
  /**
   * @openapi
   * /api/collections/image/{imageId}:
   *   get:
   *     tags:
   *       - Cards
   *     summary: Stream a card image by ID
   *     parameters:
   *       - in: path
   *         name: imageId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Image stream
   *       '404':
   *         description: Image not found
   */
  router.get(`${path}/image/:imageId`, Handlers.streamImageHandler);

  return router;
};
