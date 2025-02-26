import express from "express";
import * as usageController from "../controllers/usage.controller";
import {
  authenticateStaff,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  usageController.getUsage
);

export const usageRouter = router;
