import { Router, type Request, type Response } from "express";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error.ts";
import { DriverInUseError } from "../../../../shared/domain/errors/driver-in-use.error.ts";
import { AutomobileInUseError } from "../../../../shared/domain/errors/automobile-in-use.error.ts";
import { createUsageSchema } from "../dto/create-usage.dto.ts";
import { CreateUsageUseCase } from "../../../application/use-cases/create-usage.use-case.ts";
import type { ICreateUsageUseCase } from "../../../application/ports/in/create-usage.use-case.port.ts";
import { finishUsageParamsSchema } from "../dto/finish-usage-params.dto.ts";
import { FinishUsageUseCase } from "../../../application/use-cases/finish-usage.use-case.ts";
import type { IFinishUsageUseCase } from "../../../application/ports/in/finish-usage.use-case.port.ts";
import { ListUsagesUseCase } from "../../../application/use-cases/list-usages.use-case.ts";
import type { IListUsagesUseCase } from "../../../application/ports/in/list-usages.use-case.port.ts";

const usagesRouter = Router();

usagesRouter.get("/", async function (_req: Request, res: Response) {
  const listUsagesUseCase: IListUsagesUseCase = new ListUsagesUseCase();
  const usages = await listUsagesUseCase.execute({});

  return res.status(200).json({
    message: "Listagem realizada com sucesso",
    code: 200,
    content: usages,
  });
});

usagesRouter.post("/create", async function (req: Request, res: Response) {
  const bodyValidation = createUsageSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({
      message: "Payload inválido",
      code: 400,
      errors: bodyValidation.error.issues,
    });
  }

  try {
    const createUsageUseCase: ICreateUsageUseCase = new CreateUsageUseCase();
    const usage = await createUsageUseCase.execute(bodyValidation.data);

    return res.status(201).json({
      message: "Utilização criada com sucesso",
      code: 201,
      content: usage,
    });

  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({
        message: err.message,
        code: 404,
      });
    }
    if (err instanceof DriverInUseError) {
      return res.status(409).json({
        message: err.message,
        code: 409,
      });
    }
    if (err instanceof AutomobileInUseError) {
      return res.status(409).json({
        message: err.message,
        code: 409,
      });
    }
    throw err;
  }
});

usagesRouter.patch(
  "/:id/finish",
  async function (req: Request, res: Response) {
    const paramsValidation = finishUsageParamsSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        message: "Parâmetro de rota inválido",
        code: 400,
        errors: paramsValidation.error.issues,
      });
    }

    try {
      const finishUsageUseCase: IFinishUsageUseCase = new FinishUsageUseCase();
      const usage = await finishUsageUseCase.execute({
        id: paramsValidation.data.id,
      });

      return res.status(200).json({
        message: "Utilização finalizada com sucesso",
        code: 200,
        content: usage,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({
          message: err.message,
          code: 404,
        });
      }
      if (err instanceof Error && err.message.includes("already been finished")) {
        return res.status(400).json({
          message: err.message,
          code: 400,
        });
      }
      throw err;
    }
  },
);

export { usagesRouter };
