import { z } from "zod";

export const createTableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  isAvailable: z.boolean().optional().default(true),
});

export const updateTableSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
});
