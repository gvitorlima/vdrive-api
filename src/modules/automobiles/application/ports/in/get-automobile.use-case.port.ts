import type { AutomobileOutput } from "../../outputs/automobile.output.ts";
import type { GetAutomobileInput } from "../../inputs/get-automobile.input.ts";

export interface IGetAutomobileUseCase {
  execute(input: GetAutomobileInput): Promise<AutomobileOutput>;
}
