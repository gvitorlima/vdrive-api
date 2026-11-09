import { Router } from "express";
import { driversRouter } from "./drivers/adapters/in/http/drivers-controller.ts";
import { automobilesRouter } from "./automobiles/adapters/in/http/automobiles-controller.ts";
import { usagesRouter } from "./usages/adapters/in/http/usages-controller.ts";

const apiRouter = Router();

apiRouter.use("/drivers", driversRouter);
apiRouter.use("/automobiles", automobilesRouter);
apiRouter.use("/usages", usagesRouter);

export default apiRouter;

