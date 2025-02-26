import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const createCheckoutSession = async (restaurantId, data) => {
  const { planId, successUrl, cancelUrl } = data;

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  const subscription = await prisma.subscription.findFirst({
    where: { restaurantId },
  });

  if (subscription) {
    throw new Error("Subscription already exists");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      restaurantId,
      planId,
    },
  });

  return { sessionId: session.id, url: session.url };
};

export const updateSubscription = async (restaurantId, newPlanId) => {
  const subscription = await prisma.subscription.findFirst({
    where: { restaurantId },
    include: { plan: true },
  });

  if (!subscription) {
    throw new Error("No active subscription found");
  }

  const newPlan = await prisma.subscriptionPlan.findUnique({
    where: { id: newPlanId },
  });

  if (!newPlan) {
    throw new Error("New subscription plan not found");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    proration_behavior: "create_prorations",
    items: [
      {
        id: stripeSubscription.items.data[0].id,
        price: newPlan.stripePriceId,
      },
    ],
  });

  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      planId: newPlanId,
      endDate: new Date(stripeSubscription.current_period_end * 1000),
    },
  });

  return updatedSubscription;
};

export const cancelSubscription = async (restaurantId) => {
  const subscription = await prisma.subscription.findFirst({
    where: { restaurantId },
  });

  if (!subscription) {
    throw new Error("No active subscription found");
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "CANCELING",
      cancelledAt: new Date(),
    },
  });

  return updatedSubscription;
};

export const getSubscription = async (restaurantId) => {
  const subscription = await prisma.subscription.findFirst({
    where: { restaurantId },
    include: {
      plan: true,
    },
  });

  if (!subscription) {
    throw new Error("No subscription found");
  }

  return subscription;
};
