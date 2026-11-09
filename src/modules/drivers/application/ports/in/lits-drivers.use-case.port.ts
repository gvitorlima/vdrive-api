import type { ListDriversInput } from "../../inputs/list-drivers.input.ts";

export interface IListDriversUseCase {
  execute(content: ListDriversInput): Promise<any>;
}
