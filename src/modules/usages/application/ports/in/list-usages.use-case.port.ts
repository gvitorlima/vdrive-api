import type { Usage } from "../../../domain/entities/usage.entity.ts";
import type { ListUsagesInput } from "../../inputs/list-usages.input.ts";

export interface IListUsagesUseCase {
  execute(input: ListUsagesInput): Promise<Usage[]>;
}
