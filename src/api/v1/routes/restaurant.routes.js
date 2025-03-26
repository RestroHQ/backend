import express from "express";
import * as restaurantController from "../controllers/restaurant.controller";
import {
  authenticate,
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
import { orderRouter } from "./order.routes";
import { menuRouter } from "./menu.routes";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(paginationSchema),
  restaurantController.getRestaurants
);

router.get("/me", authenticate, restaurantController.getUserRestaurants);

router.get("/:restaurantId", restaurantController.getRestaurantById);

router.post(
  "/",
  authenticate,
  authorize(["USER"]),
  validate(createRestaurantSchema),
  restaurantController.createRestaurant
);

router.patch(
  "/:restaurantId",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER"]),
  validate(updateRestaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  "/:restaurantId",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER"]),
  restaurantController.deleteRestaurant
);

router.use("/:restaurantId/usage", usageRouter);
router.use("/:restaurantId/staff", staffRouter);
router.use("/:restaurantId/subscription", subscriptionRouter);
router.use("/:restaurantId/reservations", reservationRouter);
router.use("/:restaurantId/customers", customerRouter);
router.use("/:restaurantId/tables", tableRouter);
router.use("/:restaurantId/timeslot", timeSlotRouter);
router.use("/:restaurantId/orders", orderRouter);
router.use("/:restaurantId/menus", menuRouter);

export const restaurantRouter = router;
