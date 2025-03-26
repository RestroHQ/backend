import express from "express";
import {
  authenticate,
  authorize,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addStaffSchema, paginationSchema } from "../schemas/staff.schema";
import * as staffController from "../controllers/staff.controller";

const router = express.Router({ mergeParams: true });

router.get(
  "",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(paginationSchema),
  staffController.getRestaurantStaff
);

router.post(
  "",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(addStaffSchema),
  staffController.addRestaurantStaff
);

router.delete(
  "/:userId",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  staffController.removeRestaurantStaff
);

export const staffRouter = router;
