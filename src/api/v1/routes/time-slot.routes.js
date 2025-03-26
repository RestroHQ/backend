import express from "express";
import {
  authenticateStaff,
  authorize,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createTimeSlotSchema,
  updateTimeSlotSchema,
  timeSlotQuerySchema,
} from "../schemas/time-slot.schema";
import * as timeSlotController from "../controllers/time-slot.controller";

const router = express.Router({ mergeParams: true });



router.get(
  "/available-time-slots",
  validate(timeSlotQuerySchema),
  timeSlotController.getAvailableTimeSlots
);


router.post(
  "/",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(createTimeSlotSchema),
  timeSlotController.createTimeSlot
);

router.patch(
  "/:timeSlotId",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(updateTimeSlotSchema),
  timeSlotController.updateTimeSlot
);



export const timeSlotRouter = router;
