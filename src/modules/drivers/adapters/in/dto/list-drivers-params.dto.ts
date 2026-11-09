import { z } from "zod";

/**
 * 128 caracteres apenas para ter um limite.
 */
export const ListDriversSchema = z.object({
  name: z.string().min(1).max(128).optional(),
});

export type ListDriversParamsDTO = z.infer<typeof ListDriversSchema>;
