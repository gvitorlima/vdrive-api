import { Router, type Request, type Response } from "express";
import { createDriverSchema } from "../dto/create-driver.dto.ts";
import { CreateDriverUseCase } from "../../../application/use-cases/create-driver.use-case.ts";
import type { ICreateDriverUseCase } from "../../../application/ports/in/create-driver.use-case.port.ts";
import type { CreateDriverInput } from "../../../application/inputs/create-driver.input.ts";
import type { IListDriversUseCase } from "../../../application/ports/in/lits-drivers.use-case.port.ts";
import { ListDriversUseCase } from "../../../application/use-cases/list-drivers.use-case.ts";
import { ListDriversSchema } from "../dto/list-drivers-params.dto.ts";
import type { ListDriversInput } from "../../../application/inputs/list-drivers.input.ts";

const driversRouter = Router();

driversRouter.get("/", function (req: Request, res: Response) {
  res.json([{ id: 1, name: "Gabriel" }]);
});

driversRouter.get("/list", async function (req: Request, res: Response) {
  const queryParams = req.query;
  const validationResult = ListDriversSchema.safeParse(queryParams);

  if (!validationResult.success) {
    /**
     * TODO - Criar um handle para erros, ou não. Não vai ter frontend mesmo
     */
    return res.status(400).json([
      {
        message: "Parâmetro de busca invalido",
        code: 400,
        errors: validationResult.error.issues,
      },
    ]);
  }

  const parsedQueryParams = validationResult.data;

  console.log(parsedQueryParams);

  const listDriversUseCase: IListDriversUseCase = new ListDriversUseCase();
  const drivers = await listDriversUseCase.execute(
    parsedQueryParams as ListDriversInput,
  );

  res.status(200).json([
    {
      message: "Listagem realizada com sucesso",
      content: drivers,
      code: 200,
    },
  ]);
});

driversRouter.post("/create", async function (req: Request, res: Response) {
  const payload = req.body;
  const validationResult = createDriverSchema.safeParse(payload);

  if (!validationResult.success) {
    return res.status(400).json([
      {
        message: "Payload Invalido",
        code: 400,
        errors: validationResult.error.issues,
      },
    ]);
  }

  const parsedPayload = validationResult.data;

  /**
   * Como não temos algo para injetar as dependencias, vou deixar assim mesmo por hora
   */
  const createDriverUseCase: ICreateDriverUseCase = new CreateDriverUseCase();
  await createDriverUseCase.execute(parsedPayload as CreateDriverInput);

  res.status(201).json([
    {
      message: "Motorista criado com sucesso",
      code: 201,
    },
  ]);
});

export { driversRouter };
