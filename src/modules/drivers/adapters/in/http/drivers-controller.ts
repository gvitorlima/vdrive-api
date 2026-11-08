import { Router, type Request, type Response } from "express";
import { createDriverSchema } from "../dto/create-driver.dto.ts";

const driversRouter = Router();

driversRouter.get("/", function (req: Request, res: Response) {
  res.json([{ id: 1, name: "Gabriel" }]);
});

driversRouter.post("/create", function (req: Request, res: Response) {
  const payload = req.body;
  const validationResult = createDriverSchema.safeParse(payload);

  if (!validationResult.success) {
    /**
     * TODO - Criar um handle para erros, ou não. Não vai ter frontend mesmo
     */
    return res.status(400).json([
      {
        message: "Payload Invalido",
        errors: validationResult.error.issues,
      },
    ]);
  }

  const parsedPayload = validationResult.data;
  res.json(parsedPayload);
});

export { driversRouter };
