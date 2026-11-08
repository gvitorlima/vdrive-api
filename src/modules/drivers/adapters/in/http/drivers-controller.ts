import { Router, type Request, type Response } from "express";
import { createDriverSchema } from "../dto/create-driver.dto.ts";
import { CreateDriverUseCase } from "../../../application/use-cases/create-driver.use-case.ts";
import type { ICreateDriverUseCase } from "../../../application/ports/in/create-driver.use-case.port.ts";
import type { CreateDriverInput } from "../../../application/inputs/create-driver.input.ts";

const driversRouter = Router();

/**
 * Como não temos algo para injetar as dependencias, vou deixar assim mesmo por hora
 */
const createDriverUseCase: ICreateDriverUseCase = new CreateDriverUseCase();

driversRouter.get("/", function (req: Request, res: Response) {
  res.json([{ id: 1, name: "Gabriel" }]);
});

driversRouter.post("/create", async function (req: Request, res: Response) {
  const payload = req.body;
  const validationResult = createDriverSchema.safeParse(payload);

  if (!validationResult.success) {
    /**
     * TODO - Criar um handle para erros, ou não. Não vai ter frontend mesmo
     */
    return res.status(400).json([
      {
        message: "Payload Invalido",
        code: 400,
        errors: validationResult.error.issues,
      },
    ]);
  }

  const parsedPayload = validationResult.data;
  await createDriverUseCase.execute(parsedPayload as CreateDriverInput);

  res.status(201).json([
    {
      message: "Motorista criado com sucesso",
      code: 201,
    },
  ]);
});

export { driversRouter };
