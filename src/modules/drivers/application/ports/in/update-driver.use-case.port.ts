import type { Driver } from "../../../domain/entities/driver.entity.ts";
import type { UpdateDriverInput } from "../../inputs/update-driver.input.ts";

export interface IUpdateDriverUseCase {
  execute(input: UpdateDriverInput): Promise<Driver>;
}
