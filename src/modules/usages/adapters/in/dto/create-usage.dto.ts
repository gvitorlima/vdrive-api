import { z } from "zod";

export const createUsageSchema = z.object({
  driverId: z.string().min(1),
  automobileId: z.string().min(1),
  reason: z.string().min(5).max(500),
});

export type CreateUsageDTO = z.infer<typeof createUsageSchema>;
