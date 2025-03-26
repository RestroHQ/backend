import { z } from "zod";

export const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  interval: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
});