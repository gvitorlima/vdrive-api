import type { Driver } from "../../../domain/entities/driver.entity.ts";
import type { CreateDriverInput } from "../../inputs/create-driver.input.ts";

export interface IDriverRepositoryPort {
  list(name?: string): Promise<Driver[]>;
  get(): Promise<any>;
  create(content: CreateDriverInput): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}
