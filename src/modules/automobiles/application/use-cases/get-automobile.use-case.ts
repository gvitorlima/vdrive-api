import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error.ts";
import type { GetAutomobileInput } from "../inputs/get-automobile.input.ts";
import type { AutomobileOutput } from "../outputs/automobile.output.ts";
import type { IGetAutomobileUseCase } from "../ports/in/get-automobile.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../usages/application/ports/out/usage-repository.port.ts";
import { UsageRepositoryAdapter } from "../../../usages/adapters/out/usage-repository.adapter.ts";

export class GetAutomobileUseCase implements IGetAutomobileUseCase {
  private readonly repository: IAutomobileRepositoryPort;
  private readonly usageRepository: IUsageRepositoryPort;

  constructor(
    repository: IAutomobileRepositoryPort = new AutomobileRepositoryAdapter(),
    usageRepository: IUsageRepositoryPort = new UsageRepositoryAdapter(),
  ) {
    this.repository = repository;
    this.usageRepository = usageRepository;
  }

  async execute(input: GetAutomobileInput): Promise<AutomobileOutput> {
    const automobile = await this.repository.findById(input.id);

    if (!automobile) {
      throw new NotFoundError("Automobile", input.id);
    }

    const activeUsage =
      await this.usageRepository.findActiveByAutomobileId(
        automobile.getId(),
      );

    const usages = await this.usageRepository.findAllByAutomobileId(
      automobile.getId(),
    );

    return {
      ...automobile.toObject(),
      inUse: activeUsage !== null,
      history: usages.map((usage) => usage.toObject()),
    };
  }
}

