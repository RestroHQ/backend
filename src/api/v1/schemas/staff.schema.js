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

export const addStaffSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["ADMIN", "CASHIER"]),
});
