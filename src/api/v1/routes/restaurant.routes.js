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
  restaurantController.getRestaurants
);
router.get("/:id", authenticate, restaurantController.getRestaurantById);

router.post(
  "/",
  authenticate,
  authorize(["USER"]),
  validate(createRestaurantSchema),
  restaurantController.createRestaurant
);

router.patch(
  "/:id",
  authenticate,
  authorize(["USER"]),
  validate(updateRestaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  "/:id",
  authenticate,
  authorize(["USER"]),
  restaurantController.deleteRestaurant
);

router.get(
  "/:id/staff",
  authenticate,
  authorize(["USER"]),
  validate(paginationSchema),
  restaurantController.getRestaurantStaff
);

router.post(
  "/:id/staff",
  authenticate,
  authorize(["USER"]),
  validate(addStaffSchema),
  restaurantController.addRestaurantStaff
);

router.delete(
  "/:id/staff/:userId",
  authenticate,
  authorize(["USER"]),
  restaurantController.removeRestaurantStaff
);

export const restaurantRouter = router;
