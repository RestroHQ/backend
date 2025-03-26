import { Router } from "express";
import * as subscriptionController from "../controllers/subscription.controller";
import {
  authenticate,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCheckoutSessionSchema } from "../schemas/subscription.schema";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER"]),
  subscriptionController.getSubscription
);

router.post(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER"]),
  validate(createCheckoutSessionSchema),
  subscriptionController.createCheckoutSession
);

router.patch(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER"]),
  subscriptionController.updateSubscription
);

router.delete(
  "/",
  authenticate,
  authorizeRestaurantRole(["OWNER"]),
  subscriptionController.cancelSubscription
);

router.get("/success", subscriptionController.onCheckoutSuccess);

router.get("/cancel", subscriptionController.onCheckoutCancel);

export const subscriptionRouter = router;
