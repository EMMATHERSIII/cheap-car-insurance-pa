import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().optional(),
  ownerOpenId: z.string().optional(),
});

export const ENV = envSchema.parse(process.env);
