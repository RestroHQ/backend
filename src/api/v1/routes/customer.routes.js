import express from "express";
import {
  authenticate,
  authorize,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import {
  authenticateCustomer,
  authorizeCustomerOwnership,
  verifyCustomerRestaurant,
} from "../middlewares/customer.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  registerCustomerSchema,
  loginCustomerSchema,
  updateCustomerSchema,
  customerPaginationSchema,
} from "../schemas/customer.schema";
import * as customerController from "../controllers/customer.controller";

const router = express.Router({ mergeParams: true });

router.post(
  "/register",
  validate(registerCustomerSchema),
  customerController.registerCustomer
);

router.post(
  "/login",
  validate(loginCustomerSchema),
  customerController.loginCustomer
);

router.get(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(customerPaginationSchema),
  customerController.getCustomers
);

router.get(
  "/:customerId",
  authenticate,
  authorize(["ADMIN"]),
  customerController.getCustomerById
);

router.patch(
  "/:customerId",
  authenticateCustomer,
  authorizeCustomerOwnership,
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

router.delete(
  "/:customerId",
  authenticateCustomer,
  authorizeCustomerOwnership,
  customerController.deleteCustomer
);

export const customerRouter = router;
