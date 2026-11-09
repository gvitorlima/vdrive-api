import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import type { Automobile } from "../../domain/entities/automobile.entity.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { UpdateAutomobileInput } from "../inputs/update-automobile.input.ts";
import type { IUpdateAutomobileUseCase } from "../ports/in/update-automobile.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";

export class UpdateAutomobileUseCase implements IUpdateAutomobileUseCase {
  private readonly repository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  async execute(input: UpdateAutomobileInput): Promise<Automobile> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Automobile", input.id);
    }

    const updated = existing.update(input.plate, input.color, input.brand);
    return await this.repository.update(updated);
  }
}
