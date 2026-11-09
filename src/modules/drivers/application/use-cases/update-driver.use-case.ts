import { DriverRepositoryAdapter } from "../../adapters/out/driver-repository.adapter.ts";
import type { Driver } from "../../domain/entities/driver.entity.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { UpdateDriverInput } from "../inputs/update-driver.input.ts";
import type { IUpdateDriverUseCase } from "../ports/in/update-driver.use-case.port.ts";
import type { IDriverRepositoryPort } from "../ports/out/driver-repository.port.ts";

export class UpdateDriverUseCase implements IUpdateDriverUseCase {
  private readonly repository: IDriverRepositoryPort;

  constructor(
    repository: IDriverRepositoryPort = new DriverRepositoryAdapter(),
  ) {
    this.repository = repository;
  }

  async execute(input: UpdateDriverInput): Promise<Driver> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Driver", input.id);
    }

    /**
     * Cria nova instância com nome atualizado, preservando o ID.
     * O adapter persiste a entidade atualizada.
     */
    const updated = existing.update(input.name);
    return await this.repository.update(updated);
  }
}
