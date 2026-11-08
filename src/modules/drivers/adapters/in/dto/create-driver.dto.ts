import { z } from "zod";

/**
 * 128 caracteres apenas para ter um limite.
 */
export const createDriverSchema = z.object({
  name: z.string().min(8).max(128),
});

export type CreateDriverDTO = z.infer<typeof createDriverSchema>;
