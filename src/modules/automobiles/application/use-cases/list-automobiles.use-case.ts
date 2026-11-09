import { AutomobileRepositoryAdapter } from "../../adapters/out/automobile-repository.adapter.ts";
import type { AutomobileOutput } from "../outputs/automobile.output.ts";
import type { ListAutomobilesInput } from "../inputs/list-automobiles.input.ts";
import type { IListAutomobilesUseCase } from "../ports/in/list-automobiles.use-case.port.ts";
import type { IAutomobileRepositoryPort } from "../ports/out/automobile-repository.port.ts";
import type { IUsageRepositoryPort } from "../../../usages/application/ports/out/usage-repository.port.ts";
import { UsageRepositoryAdapter } from "../../../usages/adapters/out/usage-repository.adapter.ts";

export class ListAutomobilesUseCase implements IListAutomobilesUseCase {
  private readonly repository: IAutomobileRepositoryPort =
    new AutomobileRepositoryAdapter();

  private readonly usageRepository: IUsageRepositoryPort =
    new UsageRepositoryAdapter();

  async execute(input: ListAutomobilesInput): Promise<AutomobileOutput[]> {
    const automobiles = await this.repository.list(input.color, input.brand);

    return await Promise.all(
      automobiles.map(async (automobile) => {

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
      }),
    );
  }
}

