import { z } from "zod";

export const registerCustomerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  username: z.string().min(3).max(20).optional(),
  password: z.string().min(6),
  phone: z.string().min(10).max(20).optional(),
});

export const loginCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(20).optional(),
  phone: z.string().min(10).max(20).optional(),
  image: z.string().optional(),
});

export const customerPaginationSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortBy: z.enum(["name", "email", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});