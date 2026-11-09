import type { Driver } from "../../../domain/entities/driver.entity.ts";
import type { GetDriverInput } from "../../inputs/get-driver.input.ts";

export interface IGetDriverUseCase {
  execute(input: GetDriverInput): Promise<Driver>;
}
