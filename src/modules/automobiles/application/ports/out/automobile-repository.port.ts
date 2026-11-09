import type { Automobile } from "../../../domain/entities/automobile.entity.ts";

export interface IAutomobileRepositoryPort {
  list(color?: string, brand?: string): Promise<Automobile[]>;
  findById(id: string): Promise<Automobile | null>;
  create(automobile: Automobile): Promise<Automobile>;
  update(automobile: Automobile): Promise<Automobile>;
  delete(id: string): Promise<void>;
}

