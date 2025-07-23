import { openApiDocument } from "../infra/swagger/swagger";
import { accountRouter } from "./user";
import { Application } from "express";
import * as swaggerUi from "swagger-ui-express";

export const routeMux = (app: Application) => {
  /*  app.use("/api/cards", cardRoutes); */
  /* app.use("/api/collections", collectionRoutes) */
  app.use(accountRouter);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
};
