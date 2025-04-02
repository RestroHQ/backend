import express from "express";
import * as orderController from "../controllers/order.controller";
import {
  authenticateStaff,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createOrderSchema,
  orderQuerySchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema";
import { authenticateCustomer } from "../middlewares/customer.middleware";
import { checkResourceLimit, validateSubscription } from "../middlewares/subscription.middleware";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CHEF", "WAITER"]),
  validate(orderQuerySchema),
  orderController.getOrders
);

router.post(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "WAITER"]),
  validate(createOrderSchema),
  validateSubscription,
  checkResourceLimit("orders"),
  orderController.createOrder
);

router.patch(
  "/:orderId/status",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CHEF"]),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

router.post(
  "/customer",
  authenticateCustomer,
  validate(createOrderSchema),
  orderController.createOrder
);

export const orderRouter = router;
