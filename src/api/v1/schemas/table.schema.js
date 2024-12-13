import { z } from "zod";

export const createTableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  capacity: z.number().positive("Capacity must be a positive number"),
});

export const updateTableSchema = createTableSchema.partial();

