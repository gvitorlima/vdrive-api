import { z } from "zod";

export const deleteAutomobileParamsSchema = z.object({
  id: z.string().min(1),
});

export type DeleteAutomobileParamsDTO = z.infer<
  typeof deleteAutomobileParamsSchema
>;
