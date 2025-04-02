import express from "express";
import {
  authenticateStaff,
  authorize,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addStaffSchema, paginationSchema } from "../schemas/staff.schema";
import * as staffController from "../controllers/staff.controller";
import { checkResourceLimit, validateSubscription } from "../middlewares/subscription.middleware";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(paginationSchema),
  staffController.getRestaurantStaff
);

router.post(
  "/",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(addStaffSchema),
  validateSubscription,
  checkResourceLimit("staff"),
  staffController.addRestaurantStaff
);

router.delete(
  "/:userId",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  staffController.removeRestaurantStaff
);

export const staffRouter = router;
