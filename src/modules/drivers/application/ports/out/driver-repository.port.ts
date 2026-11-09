import type { Driver } from "../../../domain/entities/driver.entity.ts";

export interface IDriverRepositoryPort {
  list(name?: string): Promise<Driver[]>;
  findById(id: string): Promise<Driver | null>;
  create(driver: Driver): Promise<Driver>;
  update(driver: Driver): Promise<Driver>;
  delete(id: string): Promise<void>;
}


