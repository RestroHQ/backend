import { z } from "zod";

export const createTimeSlotSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  capacity: z.number().int().positive(),
  isAvailable: z.boolean().optional().default(true),
});

export const updateTimeSlotSchema = z.object({
  capacity: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
});

export const timeSlotQuerySchema = z.object({
  date: z.string().datetime(),
  guestCount: z.number().int().positive().optional(),
});
