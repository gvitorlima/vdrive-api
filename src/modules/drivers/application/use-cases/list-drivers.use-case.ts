import type { DriverOutput } from "../outputs/driver.output.ts";
import type { ListDriversInput } from "../inputs/list-drivers.input.ts";
import type { IListDriversUseCase } from "../ports/in/list-drivers.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";
import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import type { IUsageRepositoryPort } from "../../../usages/application/ports/out/usage-repository.port.ts";
import { UsageRepositoryAdapter } from "../../../usages/adapters/out/usage-repository.adapter.ts";

export class ListDriversUseCase implements IListDriversUseCase {
  private readonly repository: IDriverRepositoryPort;
  private readonly usageRepository: IUsageRepositoryPort;

  constructor(
    repository: IDriverRepositoryPort = new DriverRepositoryAdapter(),
    usageRepository: IUsageRepositoryPort = new UsageRepositoryAdapter(),
  ) {
    this.repository = repository;
    this.usageRepository = usageRepository;
  }

  async execute(content: ListDriversInput): Promise<DriverOutput[]> {
    const drivers = await this.repository.list(content?.name);

    return await Promise.all(
      drivers.map(async (driver) => {

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
      }),
    );
  }
}

