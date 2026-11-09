import type { UsageObject } from "../../../usages/domain/entities/usage.entity.ts";

export type AutomobileOutput = {
  id: string;
  placa: string;
  cor: string;
  marca: string;
  inUse: boolean;
  history: UsageObject[];
};
