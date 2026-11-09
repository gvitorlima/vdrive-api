import { Router, type Request, type Response } from "express";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error.ts";
import { ResourceInUseError } from "../../../../shared/domain/errors/resource-in-use.error.ts";
import { createAutomobileSchema } from "../dto/create-automobile.dto.ts";
import { CreateAutomobileUseCase } from "../../../application/use-cases/create-automobile.use-case.ts";
import type { ICreateAutomobileUseCase } from "../../../application/ports/in/create-automobile.use-case.port.ts";
import type { CreateAutomobileInput } from "../../../application/inputs/create-automobile.input.ts";
import { listAutomobilesParamsSchema } from "../dto/list-automobiles-params.dto.ts";
import { ListAutomobilesUseCase } from "../../../application/use-cases/list-automobiles.use-case.ts";
import type { IListAutomobilesUseCase } from "../../../application/ports/in/list-automobiles.use-case.port.ts";
import type { ListAutomobilesInput } from "../../../application/inputs/list-automobiles.input.ts";
import { getAutomobileParamsSchema } from "../dto/get-automobile-params.dto.ts";
import { GetAutomobileUseCase } from "../../../application/use-cases/get-automobile.use-case.ts";
import type { IGetAutomobileUseCase } from "../../../application/ports/in/get-automobile.use-case.port.ts";
import {
  updateAutomobileBodySchema,
  updateAutomobileParamsSchema,
} from "../dto/update-automobile.dto.ts";
import { UpdateAutomobileUseCase } from "../../../application/use-cases/update-automobile.use-case.ts";
import type { IUpdateAutomobileUseCase } from "../../../application/ports/in/update-automobile.use-case.port.ts";
import { deleteAutomobileParamsSchema } from "../dto/delete-automobile-params.dto.ts";
import { DeleteAutomobileUseCase } from "../../../application/use-cases/delete-automobile.use-case.ts";
import type { IDeleteAutomobileUseCase } from "../../../application/ports/in/delete-automobile.use-case.port.ts";

const automobilesRouter = Router();

automobilesRouter.get("/", async function (req: Request, res: Response) {
  const queryValidation = listAutomobilesParamsSchema.safeParse(req.query);

  if (!queryValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de busca inválido",
      code: 400,
      errors: queryValidation.error.issues,
    });
  }

  const listAutomobilesUseCase: IListAutomobilesUseCase =
    new ListAutomobilesUseCase();
  const automobiles = await listAutomobilesUseCase.execute(
    queryValidation.data as ListAutomobilesInput,
  );

  return res.status(200).json({
    message: "Listagem realizada com sucesso",
    code: 200,
    content: automobiles,
  });
});

automobilesRouter.get("/:id", async function (req: Request, res: Response) {
  const paramsValidation = getAutomobileParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de rota inválido",
      code: 400,
      errors: paramsValidation.error.issues,
    });
  }

  try {
    const getAutomobileUseCase: IGetAutomobileUseCase =
      new GetAutomobileUseCase();
    const automobile = await getAutomobileUseCase.execute({
      id: paramsValidation.data.id,
    });

    return res.status(200).json({
      message: "Automóvel encontrado com sucesso",
      code: 200,
      content: automobile,
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

automobilesRouter.post("/create", async function (req: Request, res: Response) {
  const bodyValidation = createAutomobileSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({
      message: "Payload inválido",
      code: 400,
      errors: bodyValidation.error.issues,
    });
  }

  const createAutomobileUseCase: ICreateAutomobileUseCase =
    new CreateAutomobileUseCase();
  const automobile = await createAutomobileUseCase.execute(
    bodyValidation.data as CreateAutomobileInput,
  );

  return res.status(201).json({
    message: "Automóvel criado com sucesso",
    code: 201,
    content: automobile,
  });
});

automobilesRouter.put("/:id", async function (req: Request, res: Response) {
  const paramsValidation = updateAutomobileParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de rota inválido",
      code: 400,
      errors: paramsValidation.error.issues,
    });
  }

  const bodyValidation = updateAutomobileBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({
      message: "Payload inválido",
      code: 400,
      errors: bodyValidation.error.issues,
    });
  }

  try {
    const updateAutomobileUseCase: IUpdateAutomobileUseCase =
      new UpdateAutomobileUseCase();
    const automobile = await updateAutomobileUseCase.execute({
      id: paramsValidation.data.id,
      plate: bodyValidation.data.plate,
      color: bodyValidation.data.color,
      brand: bodyValidation.data.brand,
    });

    return res.status(200).json({
      message: "Automóvel atualizado com sucesso",
      code: 200,
      content: automobile,
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

automobilesRouter.delete("/:id", async function (req: Request, res: Response) {
  const paramsValidation = deleteAutomobileParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({
      message: "Parâmetro de rota inválido",
      code: 400,
      errors: paramsValidation.error.issues,
    });
  }

  try {
    const deleteAutomobileUseCase: IDeleteAutomobileUseCase =
      new DeleteAutomobileUseCase();
    await deleteAutomobileUseCase.execute({ id: paramsValidation.data.id });

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

export { automobilesRouter };
