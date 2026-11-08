import type { CreateDriverInput } from "../../inputs/create-driver.input.ts";

export interface IDriverRepositoryPort {
  list(): Promise<any>;
  get(): Promise<any>;
  create(content: CreateDriverInput): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}
