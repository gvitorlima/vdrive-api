import type { Usage } from "../../../domain/entities/usage.entity.ts";

export interface IUsageRepositoryPort {
  list(): Promise<Usage[]>;
  findById(id: string): Promise<Usage | null>;
  findActiveByDriverId(driverId: string): Promise<Usage | null>;
  findActiveByAutomobileId(automobileId: string): Promise<Usage | null>;
  findAllByDriverId(driverId: string): Promise<Usage[]>;
  findAllByAutomobileId(automobileId: string): Promise<Usage[]>;
  create(usage: Usage): Promise<Usage>;
  update(usage: Usage): Promise<Usage>;
}
