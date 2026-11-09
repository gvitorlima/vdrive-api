import { z } from "zod";

export const finishUsageParamsSchema = z.object({
  id: z.string().min(1),
});

export type FinishUsageParamsDTO = z.infer<typeof finishUsageParamsSchema>;
