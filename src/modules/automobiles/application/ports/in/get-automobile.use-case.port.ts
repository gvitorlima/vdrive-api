import type { Automobile } from "../../../domain/entities/automobile.entity.ts";
import type { GetAutomobileInput } from "../../inputs/get-automobile.input.ts";

export interface IGetAutomobileUseCase {
  execute(input: GetAutomobileInput): Promise<Automobile>;
}
