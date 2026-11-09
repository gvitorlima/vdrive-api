import { z } from "zod";

export const deleteDriverParamsSchema = z.object({
  id: z.string().min(1),
});

export type DeleteDriverParamsDTO = z.infer<typeof deleteDriverParamsSchema>;
