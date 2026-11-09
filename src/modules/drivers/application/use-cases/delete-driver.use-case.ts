import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import { UsageRepositoryAdapter } from "../../../usages/adapters/out/usage-repository.adapter.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import { ResourceInUseError } from "../../../shared/domain/errors/resource-in-use.error.ts";
import type { DeleteDriverInput } from "../inputs/delete-driver.input.ts";
import type { IDeleteDriverUseCase } from "../ports/in/delete-driver.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../usages/application/ports/out/usage-repository.port.ts";

export class DeleteDriverUseCase implements IDeleteDriverUseCase {
  private readonly repository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  private readonly usageRepository: IUsageRepositoryPort =
    new UsageRepositoryAdapter();

  async execute(input: DeleteDriverInput): Promise<void> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Driver", input.id);
    }

    const activeUsage = await this.usageRepository.findActiveByDriverId(
      input.id,
    );

    if (activeUsage) {
      throw new ResourceInUseError("Driver", input.id);
    }

    await this.repository.delete(input.id);
  }
}

