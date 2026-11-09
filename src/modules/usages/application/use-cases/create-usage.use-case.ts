import { DriverRepositoryAdapter } from "../../../drivers/adapters/out/driver-repository.adapter.ts";
import { AutomobileRepositoryAdapter } from "../../../automobiles/adapters/out/automobile-repository.adapter.ts";
import { UsageRepositoryAdapter } from "../../adapters/out/usage-repository.adapter.ts";
import { Usage } from "../../domain/entities/usage.entity.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import { DriverInUseError } from "../../../shared/domain/errors/driver-in-use.error.ts";
import { AutomobileInUseError } from "../../../shared/domain/errors/automobile-in-use.error.ts";
import type { CreateUsageInput } from "../inputs/create-usage.input.ts";
import type { ICreateUsageUseCase } from "../ports/in/create-usage.use-case.port.ts";
import type { IUsageRepositoryPort } from "../ports/out/usage-repository.port.ts";
import type { IDriverRepositoryPort } from "../../../drivers/application/ports/out/driver-repository.port.ts";
import type { IAutomobileRepositoryPort } from "../../../automobiles/application/ports/out/automobile-repository.port.ts";

export class CreateUsageUseCase implements ICreateUsageUseCase {
  private readonly usageRepository: IUsageRepositoryPort =
    new UsageRepositoryAdapter();

  private readonly driverRepository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  private readonly automobileRepository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  async execute(input: CreateUsageInput): Promise<Usage> {

    const driver = await this.driverRepository.findById(input.driverId);
    if (!driver) {
      throw new NotFoundError("Driver", input.driverId);
    }

    const automobile = await this.automobileRepository.findById(
      input.automobileId,
    );
    if (!automobile) {
      throw new NotFoundError("Automobile", input.automobileId);
    }

    const driverActiveUsage =
      await this.usageRepository.findActiveByDriverId(input.driverId);
    if (driverActiveUsage) {
      throw new DriverInUseError(input.driverId);
    }

    const automobileActiveUsage =
      await this.usageRepository.findActiveByAutomobileId(input.automobileId);
    if (automobileActiveUsage) {
      throw new AutomobileInUseError(input.automobileId);
    }

    const usage = Usage.create(
      input.reason,
      { id: driver.getId(), name: driver.getName() },
      {
        id: automobile.getId(),
        plate: automobile.getPlate(),
        color: automobile.getColor(),
        brand: automobile.getBrand(),
      },
    );

    return await this.usageRepository.create(usage);
  }
}
