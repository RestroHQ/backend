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

export const restaurantRouter = router;
