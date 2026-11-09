import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import type { Automobile } from "../../domain/entities/automobile.entity.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { GetAutomobileInput } from "../inputs/get-automobile.input.ts";
import type { IGetAutomobileUseCase } from "../ports/in/get-automobile.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";

export class GetAutomobileUseCase implements IGetAutomobileUseCase {
  private readonly repository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  async execute(input: GetAutomobileInput): Promise<Automobile> {
    const automobile = await this.repository.findById(input.id);

    if (!automobile) {
      throw new NotFoundError("Automobile", input.id);
    }

    return automobile;
  }
}
