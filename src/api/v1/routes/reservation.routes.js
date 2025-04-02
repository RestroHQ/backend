import express from "express";
import * as reservationController from "../controllers/reservation.controller";
import {
  authenticateStaff,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { authenticateCustomer } from "../middlewares/customer.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createReservationSchema,
  paginationSchema,
  updateReservationSchema,
} from "../schemas/reservation.schema";
import * as reservationController from "../controllers/reservation.controller";
import {
  checkResourceLimit,
  validateSubscription,
} from "../middlewares/subscription.middleware";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "WAITER"]),
  validate(paginationSchema),
  reservationController.getRestaurantReservations
);

router.post(
  "/",
  authenticateCustomer,
  validate(createReservationSchema),
  validateSubscription,
  checkResourceLimit("reservations"),
  reservationController.createReservation
);

router.patch(
  "/:reservationId",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "WAITER"]),
  validate(updateReservationSchema),
  reservationController.updateReservation
);

router.get(
  "/me",
  authenticateCustomer,
  validate(paginationSchema),
  reservationController.getCustomerReservations
);

router.get(
  "/:reservationId",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "WAITER"]),
  reservationController.getReservationById
);

export const reservationRouter = router;
