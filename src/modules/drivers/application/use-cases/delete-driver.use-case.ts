import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { DeleteDriverInput } from "../inputs/delete-driver.input.ts";
import type { IDeleteDriverUseCase } from "../ports/in/delete-driver.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";

export class DeleteDriverUseCase implements IDeleteDriverUseCase {
  private readonly repository: IDriverRepositoryPort =
    new DriverRepositoryAdapter();

  async execute(input: DeleteDriverInput): Promise<void> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Driver", input.id);
    }

    await this.repository.delete(input.id);
  }
}
