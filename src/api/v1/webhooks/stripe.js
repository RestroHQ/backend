import { config as configFile } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const { STRIPE_WEBHOOK_SECRET } = configFile;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleCheckoutSessionCompleted(session) {
  const { restaurantId, planId } = session.metadata;

  const subscription = await prisma.subscription.create({
    data: {
      restaurantId,
      planId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      status: "ACTIVE",
      startDate: new Date(),
      endDate: new Date(session.expires_at * 1000),
    },
  });

  return subscription;
}

async function handleSubscriptionUpdated(subscription) {
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: subscription.status.toUpperCase(),
      endDate: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription) {
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
}

async function handlePaymentSucceeded(invoice) {
  if (invoice.subscription) {
    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: invoice.subscription,
      },
      data: {
        status: "ACTIVE",
        lastBillingDate: new Date(),
        nextBillingDate: new Date(invoice.next_payment_attempt * 1000),
      },
    });
  }
}

async function handlePaymentFailed(invoice) {
  if (invoice.subscription) {
    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: invoice.subscription,
      },
      data: {
        status: "PAST_DUE",
      },
    });
  }
}

export default async function stripeWebhookHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const payload = req.rawBody || req.body;

    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
