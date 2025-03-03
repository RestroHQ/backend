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

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CHEF", "WAITER"]),
  validate(orderQuerySchema),
  orderController.getOrders
);