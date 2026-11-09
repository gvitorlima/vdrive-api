import { z } from "zod";

export const listAutomobilesParamsSchema = z.object({
  color: z.string().min(1).max(50).optional(),
  brand: z.string().min(1).max(50).optional(),
});

export type ListAutomobilesParamsDTO = z.infer<
  typeof listAutomobilesParamsSchema
>;
