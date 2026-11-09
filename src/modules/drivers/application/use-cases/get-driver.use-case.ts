import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { GetDriverInput } from "../inputs/get-driver.input.ts";
import type { DriverOutput } from "../outputs/driver.output.ts";
import type { IGetDriverUseCase } from "../ports/in/get-driver.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../usages/application/ports/out/usage-repository.port.ts";
import { UsageRepositoryAdapter } from "../../../usages/adapters/out/usage-repository.adapter.ts";

export class GetDriverUseCase implements IGetDriverUseCase {
  private readonly repository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  private readonly usageRepository: IUsageRepositoryPort =
    new UsageRepositoryAdapter();

  async execute(input: GetDriverInput): Promise<DriverOutput> {
    const driver = await this.repository.findById(input.id);

    if (!driver) {
      throw new NotFoundError("Driver", input.id);
    }

    const activeUsage = await this.usageRepository.findActiveByDriverId(
      driver.getId(),
    );

    const usages = await this.usageRepository.findAllByDriverId(
      driver.getId(),
    );

    return {
      ...driver.toObject(),
      inUse: activeUsage !== null,
      history: usages.map((usage) => usage.toObject()),
    };
  }
}

