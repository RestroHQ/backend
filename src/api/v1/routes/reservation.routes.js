import express from "express";
import * as reservationController from "../controllers/reservation.controller";
import {
  authenticate,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { authenticateCustomer } from "../middlewares/customer.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createReservationSchema,
  paginationSchema,
  updateReservationSchema,
} from "../schemas/reservation.schema";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER", "WAITER"]),
  validate(paginationSchema),
  reservationController.getRestaurantReservations
);

router.post(
  "/",
  authenticateCustomer,
  validate(createReservationSchema),
  reservationController.createReservation
);

router.patch(
  "/:reservationId",
  authenticate,
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
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER", "WAITER"]),
  reservationController.getReservationById
);

export const reservationRouter = router;
