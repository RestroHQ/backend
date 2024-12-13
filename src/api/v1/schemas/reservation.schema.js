import { z } from "zod";

export const createReservationSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  userId: z.string().min(1, "User ID is required"),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format (YYYY-MM-DD)"
    ),
  time: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format (HH:MM)"
    ),
  guests: z.number().positive("Guests must be a positive number"),
});

export const updateReservationSchema = createReservationSchema.partial();

export const manageWaitlistSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format (YYYY-MM-DD)"
    ),
  guests: z.number().positive("Guests must be a positive number"),
  userId: z.string().min(1, "User ID is required"),
  timeSlotId: z.string().optional(),
});

export const checkAvailabilitySchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format (YYYY-MM-DD)"
    ),
  guests: z.number().positive("Guests must be a positive number"),
});
