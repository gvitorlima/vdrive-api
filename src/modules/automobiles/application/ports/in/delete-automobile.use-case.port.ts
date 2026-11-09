import type { DeleteAutomobileInput } from "../../inputs/delete-automobile.input.ts";

export interface IDeleteAutomobileUseCase {
  execute(input: DeleteAutomobileInput): Promise<void>;
}
