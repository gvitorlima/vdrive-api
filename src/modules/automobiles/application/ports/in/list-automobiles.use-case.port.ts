import type { AutomobileOutput } from "../../outputs/automobile.output.ts";
import type { ListAutomobilesInput } from "../../inputs/list-automobiles.input.ts";

export interface IListAutomobilesUseCase {
  execute(input: ListAutomobilesInput): Promise<AutomobileOutput[]>;
}
