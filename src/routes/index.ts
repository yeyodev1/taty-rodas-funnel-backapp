import express, { Application } from "express";
import checkoutRouter from "./checkout.routes";

function routerApi(app: Application) {
  const router = express.Router();
  app.use("/api", router);

  router.use("/checkout", checkoutRouter);
}

export default routerApi;
