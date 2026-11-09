import { Router, type Request, type Response } from "express";
import { createDriverSchema } from "../dto/create-driver.dto.ts";
import { CreateDriverUseCase } from "../../../application/use-cases/create-driver.use-case.ts";
import type { ICreateDriverUseCase } from "../../../application/ports/in/create-driver.use-case.port.ts";
import type { CreateDriverInput } from "../../../application/inputs/create-driver.input.ts";
import type { IListDriversUseCase } from "../../../application/ports/in/list-drivers.use-case.port.ts";
import { ListDriversUseCase } from "../../../application/use-cases/list-drivers.use-case.ts";
import { ListDriversSchema } from "../dto/list-drivers-params.dto.ts";
import type { ListDriversInput } from "../../../application/inputs/list-drivers.input.ts";
import { getDriverParamsSchema } from "../dto/get-driver-params.dto.ts";
import { GetDriverUseCase } from "../../../application/use-cases/get-driver.use-case.ts";
import type { IGetDriverUseCase } from "../../../application/ports/in/get-driver.use-case.port.ts";
import {
  updateDriverBodySchema,
  updateDriverParamsSchema,
} from "../dto/update-driver.dto.ts";
import { UpdateDriverUseCase } from "../../../application/use-cases/update-driver.use-case.ts";
import type { IUpdateDriverUseCase } from "../../../application/ports/in/update-driver.use-case.port.ts";
import { deleteDriverParamsSchema } from "../dto/delete-driver-params.dto.ts";
import { DeleteDriverUseCase } from "../../../application/use-cases/delete-driver.use-case.ts";
import type { IDeleteDriverUseCase } from "../../../application/ports/in/delete-driver.use-case.port.ts";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error.ts";
import { ResourceInUseError } from "../../../../shared/domain/errors/resource-in-use.error.ts";

const driversRouter = Router();

driversRouter.get("/", async function (req: Request, res: Response) {
  const queryParams = req.query;
  const validationResult = ListDriversSchema.safeParse(queryParams);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Parâmetro de busca inválido",
      code: 400,
      errors: validationResult.error.issues,
    });
  }

  const parsedQueryParams = validationResult.data;

  const listDriversUseCase: IListDriversUseCase = new ListDriversUseCase();
  const drivers = await listDriversUseCase.execute(
    parsedQueryParams as ListDriversInput,
  );

  return res.status(200).json({
    message: "Listagem realizada com sucesso",
    code: 200,
    content: drivers,
  });
});

driversRouter.get("/:id", async function (req: Request, res: Response) {
  const paramsValidation = getDriverParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de rota inválido",
      code: 400,
      errors: paramsValidation.error.issues,
    });
  }

  try {
    const getDriverUseCase: IGetDriverUseCase = new GetDriverUseCase();
    const driver = await getDriverUseCase.execute({ id: paramsValidation.data.id });

    return res.status(200).json({
      message: "Motorista encontrado com sucesso",
      code: 200,
      content: driver,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({
        message: err.message,
        code: 404,
      });
    }
    throw err;
  }
});

driversRouter.post("/create", async function (req: Request, res: Response) {
  const payload = req.body;
  const validationResult = createDriverSchema.safeParse(payload);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Payload inválido",
      code: 400,
      errors: validationResult.error.issues,
    });
  }

  const parsedPayload = validationResult.data;

  /**
   * Como não temos algo para injetar as dependencias, vou deixar assim mesmo por hora
   */
  const createDriverUseCase: ICreateDriverUseCase = new CreateDriverUseCase();
  const driver = await createDriverUseCase.execute(parsedPayload as CreateDriverInput);

  return res.status(201).json({
    message: "Motorista criado com sucesso",
    code: 201,
    content: driver,
  });
});

driversRouter.put("/:id", async function (req: Request, res: Response) {
  const paramsValidation = updateDriverParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de rota inválido",
      code: 400,
      errors: paramsValidation.error.issues,
    });
  }

  const bodyValidation = updateDriverBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({
      message: "Payload inválido",
      code: 400,
      errors: bodyValidation.error.issues,
    });
  }

  try {
    const updateDriverUseCase: IUpdateDriverUseCase = new UpdateDriverUseCase();
    const driver = await updateDriverUseCase.execute({
      id: paramsValidation.data.id,
      name: bodyValidation.data.name,
    });

    return res.status(200).json({
      message: "Motorista atualizado com sucesso",
      code: 200,
      content: driver,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({
        message: err.message,
        code: 404,
      });
    }
    throw err;
  }
});

driversRouter.delete("/:id", async function (req: Request, res: Response) {
  const paramsValidation = deleteDriverParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de rota inválido",
      code: 400,
      errors: paramsValidation.error.issues,
    });
  }

  try {
    const deleteDriverUseCase: IDeleteDriverUseCase = new DeleteDriverUseCase();
    await deleteDriverUseCase.execute({ id: paramsValidation.data.id });

    return res.status(204).send();
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({
        message: err.message,
        code: 404,
      });
    }
    if (err instanceof ResourceInUseError) {
      return res.status(409).json({
        message: err.message,
        code: 409,
      });
    }
    throw err;
  }
});

export { driversRouter };
