import { errorHandler } from "@/lib/error-handler";
import * as subscriptionService from "../services/subscription.service";

export const getSubscription = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const subscription =
      await subscriptionService.getSubscription(restaurantId);

    res.json(subscription);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createCheckoutSession = async (req, res) => {
  const URL = req.protocol + "://" + req.get("host");

  try {
    const { restaurantId } = req.params;
    const { planId, successUrl, cancelUrl } = req.body;

    const session = await subscriptionService.createCheckoutSession(
      restaurantId,
      {
        planId,
        successUrl:
          successUrl ||
          `${URL}/api/v1/restaurants/${restaurantId}/subscription/success`,
        cancelUrl:
          cancelUrl ||
          `${URL}/api/v1/restaurants/${restaurantId}/subscription/cancel`,
      }
    );

    res.json(session);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const subscription =
      await subscriptionService.cancelSubscription(restaurantId);

    res.json(subscription);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { planId } = req.body;

    const subscription = await subscriptionService.updateSubscription(
      restaurantId,
      planId
    );

    res.json(subscription);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const onCheckoutSuccess = async (req, res) => {
  try {
    res.json({ message: "Subscription created successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const onCheckoutCancel = async (req, res) => {
  try {
    res.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};
