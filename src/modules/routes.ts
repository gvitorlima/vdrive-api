import { Router } from "express";
import { driversRouter } from "./drivers/adapters/in/http/drivers-controller.ts";

const apiRouter = Router();

apiRouter.use("/drivers", driversRouter);

export default apiRouter;
