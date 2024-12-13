import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createReservationSchema,
  updateReservationSchema,
  manageWaitlistSchema,
  checkAvailabilitySchema,
} from "../schemas/reservation.schema";
import * as reservationController from "../controllers/reservation.controller";

const router = express.Router();

router.get(
  "/:restaurantId",
  authenticate,
  reservationController.getReservations
);

router.post(
  "/",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN", "USER"]),
  validate(createReservationSchema),
  reservationController.createReservation
);

router.put(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN", "USER"]),
  validate(updateReservationSchema),
  reservationController.updateReservation
);

router.delete(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN", "USER"]),
  reservationController.deleteReservation
);

router.post(
  "/waitlist",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN", "USER"]),
  validate(manageWaitlistSchema),
  reservationController.manageWaitlist
);

router.get(
  "/waitlist/:restaurantId",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  reservationController.getWaitlist
);

router.delete(
  "/waitlist/:id",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  reservationController.removeFromWaitlist
);

router.get(
  "/availability/:restaurantId",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN", "USER"]),
  validate(checkAvailabilitySchema),
  reservationController.checkAvailability
);

export const reservationRouter = router;
