import { UsageRepositoryAdapter } from "../../adapters/out/usage-repository.adapter.ts";
import type { Usage } from "../../domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { FinishUsageInput } from "../inputs/finish-usage.input.ts";
import type { IFinishUsageUseCase } from "../ports/in/finish-usage.use-case.port.ts";
import type { IUsageRepositoryPort } from "../ports/out/usage-repository.port.ts";

export class FinishUsageUseCase implements IFinishUsageUseCase {
  private readonly repository: IUsageRepositoryPort;

  constructor(
    repository: IUsageRepositoryPort = new UsageRepositoryAdapter(),
  ) {
    this.repository = repository;
  }

  async execute(input: FinishUsageInput): Promise<Usage> {
    const usage = await this.repository.findById(input.id);

    if (!usage) {
      throw new NotFoundError("Usage", input.id);
    }

    if (!usage.isActive()) {
      throw new Error(
        `Usage with id "${input.id}" has already been finished`,
      );
    }

    usage.finish();
    return await this.repository.update(usage);
  }
}
