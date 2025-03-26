import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  addStaffSchema,
  paginationSchema,
} from "../schemas/restaurant.schema";
import * as restaurantController from "../controllers/restaurant.controller";
import { customerRouter } from "./cutomer.routes";
import { menuRouter } from "./menu.routes";
import { reservationRouter } from "./reservation.routes";
import { reviewRouter } from "./review.routes";
import { tableRouter } from "./table.routes";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  validate(paginationSchema),
  restaurantController.getRestaurants
);
router.get(
  "/:restaurantId",
  authenticate,
  restaurantController.getRestaurantById
);

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
  validate(updateRestaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  "/:restaurantId",
  authenticate,
  authorize(["USER"]),
  restaurantController.deleteRestaurant
);

router.use("/:restaurantId/usage", usageRouter);
router.use("/:restaurantId/staff", staffRouter);
router.use("/:restaurantId/subscription", subscriptionRouter);
router.use("/:restaurantId/reservations", reservationRouter);  // ✅ Add this line
router.use("/:restaurantId/customers", customerRouter);  // ✅ Add this line
router.use("/:restaurantId/tables", tableRouter);
router.use("/:restaurantId/timeslot", timeSlotRouter);
router.use("/:restaurantId/orders", orderRouter);
router.use("/:restaurantId/menus", menuRouter);
router.use("/:restaurantId/reservations", reservationRouter);
router.use("/:restaurantId/reviews", reviewRouter);
router.use("/:restaurantId/tables", tableRouter);

export const restaurantRouter = router;
