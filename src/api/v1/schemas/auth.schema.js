import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
