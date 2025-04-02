import express from "express";
import {
  authenticateStaff,
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
import { checkResourceLimit, validateSubscription } from "../middlewares/subscription.middleware";

const router = express.Router({ mergeParams: true });

router.post(
  "/orders",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CASHIER", "WAITER"]),
  validate(createOrderSchema),
  validateSubscription,
  checkResourceLimit("orders"),
  posController.createOrder
);

router.post(
  "/orders/:orderId/payments",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CASHIER"]),
  validate(processPaymentSchema),
  posController.processPayment
);

router.post(
  "/orders/:orderId/void",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(voidOrderSchema),
  posController.voidOrder
);

router.post(
  "/payments/:paymentId/refund",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(refundPaymentSchema),
  posController.refundPayment
);

export const posRouter = router;
