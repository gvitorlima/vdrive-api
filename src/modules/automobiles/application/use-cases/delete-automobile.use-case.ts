import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import { UsageRepositoryAdapter } from "../../../usages/adapters/out/usage-repository.adapter.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import { ResourceInUseError } from "../../../shared/domain/errors/resource-in-use.error.ts";
import type { DeleteAutomobileInput } from "../inputs/delete-automobile.input.ts";
import type { IDeleteAutomobileUseCase } from "../ports/in/delete-automobile.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../usages/application/ports/out/usage-repository.port.ts";

export class DeleteAutomobileUseCase implements IDeleteAutomobileUseCase {
  private readonly repository: IAutomobileRepositoryPort;
  private readonly usageRepository: IUsageRepositoryPort;

  constructor(
    repository: IAutomobileRepositoryPort = new AutomobileRepositoryAdapter(),
    usageRepository: IUsageRepositoryPort = new UsageRepositoryAdapter(),
  ) {
    this.repository = repository;
    this.usageRepository = usageRepository;
  }

  async execute(input: DeleteAutomobileInput): Promise<void> {
    const existing = await this.repository.findById(input.id);

    if (!existing) {
      throw new NotFoundError("Automobile", input.id);
    }

    const activeUsage =
      await this.usageRepository.findActiveByAutomobileId(input.id);

    if (activeUsage) {
      throw new ResourceInUseError("Automobile", input.id);
    }

    await this.repository.delete(input.id);
  }
}

