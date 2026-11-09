import type { Usage } from "../../../domain/entities/usage.entity.ts";
import type { CreateUsageInput } from "../../inputs/create-usage.input.ts";

export interface ICreateUsageUseCase {
  execute(input: CreateUsageInput): Promise<Usage>;
}
