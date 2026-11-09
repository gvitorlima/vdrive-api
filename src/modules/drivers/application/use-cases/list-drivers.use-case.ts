import type { Driver } from "../../domain/entities/driver.entity.ts";
import type { ListDriversInput } from "../inputs/list-drivers.input.ts";
import type { IListDriversUseCase } from "../ports/in/list-drivers.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";
import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";


export class ListDriversUseCase implements IListDriversUseCase {
  /**
   * Mesma coisa, sem injeção de dependencias...
   */
  private readonly repository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  async execute(content: ListDriversInput): Promise<Driver[]> {
    return await this.repository.list(content?.name);
  }
}
