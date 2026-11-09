import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import type { Driver } from "../../domain/entities/driver.entity.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { GetDriverInput } from "../inputs/get-driver.input.ts";
import type { IGetDriverUseCase } from "../ports/in/get-driver.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";

export class GetDriverUseCase implements IGetDriverUseCase {
  private readonly repository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  async execute(input: GetDriverInput): Promise<Driver> {
    const driver = await this.repository.findById(input.id);

    if (!driver) {
      throw new NotFoundError("Driver", input.id);
    }

    return driver;
  }
}
