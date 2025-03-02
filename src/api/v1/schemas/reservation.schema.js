import { z } from "zod";

export const createReservationSchema = z.object({
  tableId: z.string().cuid(),
  timeSlotId: z.string().cuid(),
  guestCount: z.number().int().min(1),
  notes: z.string().optional(),
});

export const updateReservationSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  notes: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.string().optional().transform(Number).default("1"),
  limit: z.string().optional().transform(Number).default("10"),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
