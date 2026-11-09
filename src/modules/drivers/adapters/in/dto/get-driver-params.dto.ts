import { z } from "zod";

export const getDriverParamsSchema = z.object({
  id: z.string().min(1),
});

export type GetDriverParamsDTO = z.infer<typeof getDriverParamsSchema>;
