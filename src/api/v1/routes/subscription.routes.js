import { Router } from "express";
import * as subscriptionController from "../controllers/subscription.controller";
import {
  authenticateStaff,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCheckoutSessionSchema } from "../schemas/subscription.schema";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER"]),
  subscriptionController.getSubscription
);

router.post(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER"]),
  validate(createCheckoutSessionSchema),
  subscriptionController.createCheckoutSession
);

router.patch(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER"]),
  subscriptionController.updateSubscription
);

router.delete(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER"]),
  subscriptionController.cancelSubscription
);

router.get("/success", subscriptionController.onCheckoutSuccess);

router.get("/cancel", subscriptionController.onCheckoutCancel);

export const subscriptionRouter = router;
