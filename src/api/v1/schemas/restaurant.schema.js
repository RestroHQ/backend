import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const weekDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  email: z.string().email(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  cuisineType: z.string().min(2).max(50),
  openingTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
  closingTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
  openDays: z.array(z.enum(weekDays)).min(1),
  taxNumber: z.string().optional(),
  description: z.string().max(500).optional(),
  capacity: z.number().min(1).optional(),
  isDeliveryEnabled: z.boolean().optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export const staffSchema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "CASHIER", "USER"]),
});
