import type { Driver } from "../../../domain/entities/driver.entity.ts";
import type { CreateDriverInput } from "../../inputs/create-driver.input.ts";

export interface IDriverRepositoryPort {
  list(name?: string): Promise<Driver[]>;
  findById(id: string): Promise<Driver | null>;
  create(content: CreateDriverInput): Promise<Driver>;
  update(driver: Driver): Promise<Driver>;
  delete(id: string): Promise<void>;
}

