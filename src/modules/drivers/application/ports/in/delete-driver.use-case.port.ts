import type { DeleteDriverInput } from "../../inputs/delete-driver.input.ts";

export interface IDeleteDriverUseCase {
  execute(input: DeleteDriverInput): Promise<void>;
}
