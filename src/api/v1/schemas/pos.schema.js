import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string().optional(),
    orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
    tableId: z.string().optional(),
    items: z.array(
      z.object({
        menuItemId: z.string(),
        quantity: z.number().positive(),
        notes: z.string().optional(),
      })
    ),
    notes: z.string().optional(),
  }),
});

export const processPaymentSchema = z.object({
  body: z.object({
    payments: z.array(
      z.object({
        paymentType: z.enum(["CASH", "CARD", "DIGITAL_WALLET", "GIFT_CARD"]),
        amount: z.number().positive(),
        cardLast4: z.string().optional(),
        cardType: z.string().optional(),
        transactionId: z.string().optional(),
      })
    ),
  }),
});

export const voidOrderSchema = z.object({
  body: z.object({
    reason: z.string(),
    notes: z.string().optional(),
  }),
});

export const refundPaymentSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    reason: z.string(),
    notes: z.string().optional(),
  }),
});
