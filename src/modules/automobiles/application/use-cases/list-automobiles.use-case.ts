import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import type { Automobile } from "../../domain/entities/automobile.entity.ts";
import type { ListAutomobilesInput } from "../inputs/list-automobiles.input.ts";
import type { IListAutomobilesUseCase } from "../ports/in/list-automobiles.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";

export class ListAutomobilesUseCase implements IListAutomobilesUseCase {
  private readonly repository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  async execute(input: ListAutomobilesInput): Promise<Automobile[]> {
    return await this.repository.list(input.color, input.brand);
  }
}
