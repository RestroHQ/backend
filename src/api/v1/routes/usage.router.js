import express from "express";
import * as usageController from "../controllers/usage.controller";
import {
  authenticate,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  usageController.getUsage
);

export const usageRouter = router;
