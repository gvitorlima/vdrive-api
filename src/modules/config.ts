import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * Esquema de validação do .env usando o ZOD
 */
const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

const validationResult = envSchema.safeParse(process.env);

if (!validationResult.success) {
  throw new Error(
    `Invalid environment variables: ${z.prettifyError(validationResult.error)}`,
  );
}

export const env = validationResult.data;
