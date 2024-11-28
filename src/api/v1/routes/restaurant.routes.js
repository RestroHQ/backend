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

const router = express.Router();

router.get(
  "/",
  authenticate,
  validate(paginationSchema),
  restaurantController.getUserRestaurants,
);
router.get("/:id", authenticate, restaurantController.getRestaurantById);

router.post(
  "/",
  authenticate,
  authorize(["SUPERADMIN"]),
  validate(createRestaurantSchema),
  restaurantController.createRestaurant,
);

router.put(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN"]),
  validate(updateRestaurantSchema),
  restaurantController.updateRestaurant,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN"]),
  restaurantController.deleteRestaurant,
);

router.get(
  "/:id/staff",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  validate(paginationSchema),
  restaurantController.getRestaurantStaff,
);

router.post(
  "/:id/staff",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  validate(addStaffSchema),
  restaurantController.addRestaurantStaff,
);

router.delete(
  "/:id/staff/:userId",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  restaurantController.removeRestaurantStaff,
);

export const restaurantRouter = router;
