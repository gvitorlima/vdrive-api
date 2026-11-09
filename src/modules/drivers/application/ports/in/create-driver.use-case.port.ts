import type { Driver } from "../../../domain/entities/driver.entity.ts";
import type { CreateDriverInput } from "../../inputs/create-driver.input.ts";

export interface ICreateDriverUseCase {
  execute(content: CreateDriverInput): Promise<Driver>;
}

