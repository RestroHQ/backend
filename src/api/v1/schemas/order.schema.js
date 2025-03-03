import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.string(),
  tableId: z.string().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  deliveryAddress: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
      notes: z.string().optional(),
    })
  ),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export const orderQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  status: z
    .enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"])
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
