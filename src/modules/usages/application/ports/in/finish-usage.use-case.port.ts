import type { Usage } from "../../../domain/entities/usage.entity.ts";
import type { FinishUsageInput } from "../../inputs/finish-usage.input.ts";

export interface IFinishUsageUseCase {
  execute(input: FinishUsageInput): Promise<Usage>;
}
