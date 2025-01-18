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

const router = express.Router();

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

router.get(
  "/:restaurantId/staff",
  authenticate,
  authorize(["USER"]),
  validate(paginationSchema),
  restaurantController.getRestaurantStaff
);

router.post(
  "/:restaurantId/staff",
  authenticate,
  authorize(["USER"]),
  validate(addStaffSchema),
  restaurantController.addRestaurantStaff
);

router.delete(
  "/:restaurantId/staff/:userId",
  authenticate,
  authorize(["USER"]),
  restaurantController.removeRestaurantStaff
);

router.use("/:restaurantId/customers", customerRouter);
router.use("/:restaurantId/menus", menuRouter);
router.use("/:restaurantId/reservations", reservationRouter);
router.use("/:restaurantId/reviews", reviewRouter);
router.use("/:restaurantId/tables", tableRouter);

export const restaurantRouter = router;
