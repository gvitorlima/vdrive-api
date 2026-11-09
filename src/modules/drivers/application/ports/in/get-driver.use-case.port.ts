import type { DriverOutput } from "../../outputs/driver.output.ts";
import type { GetDriverInput } from "../../inputs/get-driver.input.ts";

export interface IGetDriverUseCase {
  execute(input: GetDriverInput): Promise<DriverOutput>;
}
