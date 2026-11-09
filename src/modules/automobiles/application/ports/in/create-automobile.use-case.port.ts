import type { Automobile } from "../../../domain/entities/automobile.entity.ts";
import type { CreateAutomobileInput } from "../../inputs/create-automobile.input.ts";

export interface ICreateAutomobileUseCase {
  execute(input: CreateAutomobileInput): Promise<Automobile>;
}
