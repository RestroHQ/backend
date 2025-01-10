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
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number, and one special character"
    ),
  phone: z.string().optional(),
  username: z.string().max(50).optional(),
  role: z
    .enum(["USER"], {
      message: "Invalid role. Set role to USER or remove the field",
    })
    .optional(),
  image: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
