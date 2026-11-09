import type { UsageObject } from "../../../usages/domain/entities/usage.entity.ts";

export type DriverOutput = {
  id: string;
  nome: string;
  inUse: boolean;
  history: UsageObject[];
};
