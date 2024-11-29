import { z } from "zod";

export const paginationSchema = z.object({
  query: z
    .object({
      page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
      limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 10)),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    })
    .optional(),
});

export const createRestaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional().nullable(),
  logo: z.any().optional(),
  coverImage: z.any().optional(),
  cuisineType: z.string().min(2, "Cuisine type must be at least 2 characters"),
  openingTime: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid opening time format (HH:MM)"
    ),
  closingTime: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid closing time format (HH:MM)"
    ),
  openDays: z
    .array(z.string())
    .min(1, "At least one open day must be selected"),
  taxNumber: z.string().optional(),
  description: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  isDeliveryEnabled: z.boolean().default(false),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export const addStaffSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["ADMIN", "CASHIER"]),
});
