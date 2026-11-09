import { UsageRepositoryAdapter } from "../../adapters/out/usage-repository.adapter.ts";
import type { Usage } from "../../domain/entities/usage.entity.ts";
import type { ListUsagesInput } from "../inputs/list-usages.input.ts";
import type { IListUsagesUseCase } from "../ports/in/list-usages.use-case.port.ts";
import type { IUsageRepositoryPort } from "../ports/out/usage-repository.port.ts";

export class ListUsagesUseCase implements IListUsagesUseCase {
  private readonly repository: IUsageRepositoryPort;

  constructor(
    repository: IUsageRepositoryPort = new UsageRepositoryAdapter(),
  ) {
    this.repository = repository;
  }

  async execute(_input: ListUsagesInput): Promise<Usage[]> {
    return await this.repository.list();
  }
}
