import { z } from "zod";

export const updateAutomobileParamsSchema = z.object({
  id: z.string().min(1),
});

export const updateAutomobileBodySchema = z.object({
  plate: z.string().min(7).max(8),
  color: z.string().min(3).max(50),
  brand: z.string().min(2).max(50),
});

export type UpdateAutomobileParamsDTO = z.infer<
  typeof updateAutomobileParamsSchema
>;
export type UpdateAutomobileBodyDTO = z.infer<typeof updateAutomobileBodySchema>;
