import express from "express";
import {
  authenticate,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createOrderSchema,
  processPaymentSchema,
  voidOrderSchema,
  refundPaymentSchema,
} from "../schemas/pos.schema";
import * as posController from "../controllers/pos.controller";

const router = express.Router({ mergeParams: true });

router.post(
  "/orders",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CASHIER", "WAITER"]),
  validate(createOrderSchema),
  posController.createOrder
);

router.post(
  "/orders/:orderId/payments",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CASHIER"]),
  validate(processPaymentSchema),
  posController.processPayment
);

router.post(
  "/orders/:orderId/void",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(voidOrderSchema),
  posController.voidOrder
);

router.post(
  "/payments/:paymentId/refund",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(refundPaymentSchema),
  posController.refundPayment
);

export const posRouter = router;
