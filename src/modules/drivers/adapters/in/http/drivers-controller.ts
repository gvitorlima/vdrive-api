import { Router, type Request, type Response } from "express";

const driversRouter = Router();

driversRouter.get("/", function (req: Request, res: Response) {
  res.json([{ id: 1, name: "Gabriel" }]);
});

export { driversRouter };
