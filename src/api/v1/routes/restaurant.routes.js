import express from "express";
import * as restaurantController from "../controllers/restaurant.controller";
import {
  authenticateStaff,
  authorize,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createRestaurantSchema,
  paginationSchema,
  updateRestaurantSchema,
} from "../schemas/restaurant.schema";
import { staffRouter } from "./staff.routes";
import { subscriptionRouter } from "./subscription.routes";
import { usageRouter } from "./usage.router";
import { reservationRouter } from "./reservation.routes.js";
import { customerRouter } from "./customer.routes";
import { tableRouter } from "./table.routes";
import { timeSlotRouter } from "./time-slot.routes";

const router = express.Router();

router.get(
  "/",
  authenticateStaff,
  authorize(["ADMIN"]),
  validate(paginationSchema),
  restaurantController.getRestaurants
);

router.get("/me", authenticateStaff, restaurantController.getUserRestaurants);

router.get("/:restaurantId", restaurantController.getRestaurantById);

router.post(
  "/",
  authenticateStaff,
  authorize(["USER"]),
  validate(createRestaurantSchema),
  restaurantController.createRestaurant
);

router.patch(
  "/:restaurantId",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER"]),
  validate(updateRestaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  "/:restaurantId",
  authenticateStaff,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER"]),
  restaurantController.deleteRestaurant
);

router.use("/:restaurantId/usage", usageRouter);
router.use("/:restaurantId/staff", staffRouter);
router.use("/:restaurantId/subscription", subscriptionRouter);
router.use("/:restaurantId/reservations", reservationRouter);  // ✅ Add this line
router.use("/:restaurantId/customers", customerRouter);  // ✅ Add this line
router.use("/:restaurantId/table", tableRouter);
router.use("/:restaurantId/timeslot", timeSlotRouter);
export const restaurantRouter = router;
