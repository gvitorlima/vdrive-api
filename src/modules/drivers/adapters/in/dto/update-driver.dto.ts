import { z } from "zod";

export const updateDriverParamsSchema = z.object({
  id: z.string().min(1),
});

/**
 * 128 caracteres apenas para ter um limite.
 */
export const updateDriverBodySchema = z.object({
  name: z.string().min(8).max(128),
});

export type UpdateDriverParamsDTO = z.infer<typeof updateDriverParamsSchema>;
export type UpdateDriverBodyDTO = z.infer<typeof updateDriverBodySchema>;
