import express from "express";
import {
  authenticate,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { analyticsQuerySchema } from "../schemas/analytics.schema";
import * as analyticsController from "../controllers/analytics.controller";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(analyticsQuerySchema),
  analyticsController.getRestaurantAnalytics
);

export const analyticsRouter = router;
