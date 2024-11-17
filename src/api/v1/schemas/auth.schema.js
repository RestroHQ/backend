import { z } from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number, and one special character",
    ),
  phone: z.string().optional(),
  username: z.string().min(3).max(50).optional(),
  image: z.any().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
