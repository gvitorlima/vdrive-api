import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import { Driver } from "../../domain/entities/driver.entity.ts";
import type { CreateDriverInput } from "../inputs/create-driver.input.ts";
import type { ICreateDriverUseCase } from "../ports/in/create-driver.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";

export class CreateDriverUseCase implements ICreateDriverUseCase {
  /**
   * Mesma coisa, sem injeção de dependencias...
   */
  private readonly repository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  async execute(content: CreateDriverInput): Promise<Driver> {
    const driver = Driver.create(content.name);
    return await this.repository.create(driver);
  }
}


