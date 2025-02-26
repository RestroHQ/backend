import { errorHandler } from "@/lib/error-handler";
import { getSubscription } from "../services/subscription.service";
import { config } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/constants/plans";
import { getUsage } from "../services/usage.service";

export const validateSubscription = async (req, res, next) => {
  try {
    const { PAYMENT_ENABLED } = config;
    if (!PAYMENT_ENABLED) {
      return next();
    }

    const { restaurantId } = req.params;

    const subscription = await prisma.subscription.findFirst({
      where: {
        restaurantId,
        status: "ACTIVE",
      },
      include: { plan: true },
    });

    if (!subscription) {
      return errorHandler(
        "You need an active subscription to access this feature",
        res,
        403
      );
    }

    const plan = PLANS[subscription.plan.tier];
    if (!plan) {
      return errorHandler("Invalid subscription plan", res, 403);
    }

    req.subscriptionLimits = plan.limits;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};

export const checkResourceLimit = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { restaurantId } = req.params;
      const limits = req.subscriptionLimits;

      if (!limits || !limits[resourceType]) {
        return next();
      }

      if (limits[resourceType] === -1) {
        return next();
      }

      const usage = await getUsage(restaurantId);

      if (usage[resourceType] >= limits[resourceType]) {
        return errorHandler(
          `You have reached the limit for ${resourceType}. Please upgrade your subscription to access this feature`,
          res,
          403
        );
      }

      next();
    } catch (error) {
      errorHandler(error, res);
    }
  };
};
