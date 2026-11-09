import type { Automobile } from "../../../domain/entities/automobile.entity.ts";
import type { ListAutomobilesInput } from "../../inputs/list-automobiles.input.ts";

export interface IListAutomobilesUseCase {
  execute(input: ListAutomobilesInput): Promise<Automobile[]>;
}
