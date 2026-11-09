import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import { Automobile } from "../../domain/entities/automobile.entity.ts";
import type { CreateAutomobileInput } from "../inputs/create-automobile.input.ts";
import type { ICreateAutomobileUseCase } from "../ports/in/create-automobile.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";

export class CreateAutomobileUseCase implements ICreateAutomobileUseCase {
  private readonly repository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  async execute(input: CreateAutomobileInput): Promise<Automobile> {
    const automobile = Automobile.create(input.plate, input.color, input.brand);
    return await this.repository.create(automobile);
  }
}

