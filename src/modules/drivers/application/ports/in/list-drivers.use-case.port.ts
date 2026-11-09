import type { DriverOutput } from "../../outputs/driver.output.ts";
import type { ListDriversInput } from "../../inputs/list-drivers.input.ts";

export interface IListDriversUseCase {
  execute(content: ListDriversInput): Promise<DriverOutput[]>;
}
