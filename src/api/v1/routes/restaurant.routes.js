import { Router } from "express";
import { validateRequest } from "@/api/v1/middlewares/validate.middleware";
import { authenticate, authorize } from "@/api/v1/middlewares/auth.middleware";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "@/api/v1/schemas/restaurant.schema";
import {
  createRestaurantHandler,
  updateRestaurantHandler,
  deleteRestaurantHandler,
  getRestaurantHandler,
  listRestaurantsHandler,
} from "@/api/v1/controllers/restaurant.controller";

export const router = Router();

router.post(
  "/",
  authenticate,
  validateRequest(createRestaurantSchema),
  createRestaurantHandler,
);

router.put(
  "/:id",
  authenticate,
  validateRequest(updateRestaurantSchema),
  authorize(["SUPERADMIN", "ADMIN"]),
  updateRestaurantHandler,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN"]),
  deleteRestaurantHandler,
);

router.get("/:id", authenticate, getRestaurantHandler);
router.get("/", authenticate, listRestaurantsHandler);
