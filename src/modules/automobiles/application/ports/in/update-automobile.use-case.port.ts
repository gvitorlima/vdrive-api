import type { Automobile } from "../../../domain/entities/automobile.entity.ts";
import type { UpdateAutomobileInput } from "../../inputs/update-automobile.input.ts";

export interface IUpdateAutomobileUseCase {
  execute(input: UpdateAutomobileInput): Promise<Automobile>;
}
