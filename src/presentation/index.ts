import { accountRouter } from "./account/account-routes";
import { Application } from "express";

export const routeMux = (app: Application) => {
  /*  app.use("/api/cards", cardRoutes); */
  /* app.use("/api/collections", collectionRoutes) */
  app.use("/api/users", accountRouter);

};

