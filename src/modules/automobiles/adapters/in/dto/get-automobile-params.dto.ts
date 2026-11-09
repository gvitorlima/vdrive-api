import { z } from "zod";

export const getAutomobileParamsSchema = z.object({
  id: z.string().min(1),
});

export type GetAutomobileParamsDTO = z.infer<typeof getAutomobileParamsSchema>;
