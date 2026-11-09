import { z } from "zod";

/**
 * Validando o tamanho das placas, existem 2 formatos. O antigo e o Mercosul
 * por isso a validação de 7 até 8 caracteres na placa.
 */
export const createAutomobileSchema = z.object({
  plate: z.string().min(7).max(8),
  color: z.string().min(3).max(50),
  brand: z.string().min(2).max(50),
});

export type CreateAutomobileDTO = z.infer<typeof createAutomobileSchema>;
