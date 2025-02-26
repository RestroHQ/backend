import { z } from "zod";

export const createSubscriptionSchema = z.object({
  planId: z.string(),
  paymentMethodId: z.string(),
});

export const createCheckoutSessionSchema = z.object({
  planId: z.string(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});
