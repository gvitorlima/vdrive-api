import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { DeleteAutomobileInput } from "../inputs/delete-automobile.input.ts";
import type { IDeleteAutomobileUseCase } from "../ports/in/delete-automobile.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";

export class DeleteAutomobileUseCase implements IDeleteAutomobileUseCase {
  private readonly repository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  async execute(input: DeleteAutomobileInput): Promise<void> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Automobile", input.id);
    }

    await this.repository.delete(input.id);
  }
}
