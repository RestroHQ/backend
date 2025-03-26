import { PLANS } from "@/lib/constants/plans";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function createOrUpdateStripePlan(planKey, planData) {
  try {
    const existingProduct = await prisma.subscriptionPlan.findFirst({
      where: {
        tier: planKey,
      },
    });

    let product;
    if (existingProduct) {
      product = { id: existingProduct.stripeProductId };
    } else {
      product = await stripe.products.create({
        name: planKey,
        description: planData.description,
        active: true,
      });
    }

    const existingMonthlyPlan = await prisma.subscriptionPlan.findFirst({
      where: {
        tier: planKey,
        interval: "month",
      },
    });

    if (!existingMonthlyPlan) {
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(planData.price.monthly * 100),
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });

      await prisma.subscriptionPlan.create({
        data: {
          name: `${planKey}_MONTHLY`,
          tier: planKey,
          stripePriceId: monthlyPrice.id,
          stripeProductId: product.id,
          price: planData.price.monthly,
          currency: "usd",
          interval: "month",
          isActive: true,
        },
      });

      // eslint-disable-next-line no-console
      console.log(`Created new ${planKey} monthly plan`);
    }

    const existingYearlyPlan = await prisma.subscriptionPlan.findFirst({
      where: {
        tier: planKey,
        interval: "year",
      },
    });

    if (!existingYearlyPlan) {
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(planData.price.yearly * 100),
        currency: "usd",
        recurring: {
          interval: "year",
        },
      });

      await prisma.subscriptionPlan.create({
        data: {
          name: `${planKey}_YEARLY`,
          tier: planKey,
          stripePriceId: yearlyPrice.id,
          stripeProductId: product.id,
          price: planData.price.yearly,
          currency: "usd",
          interval: "year",
          isActive: true,
        },
      });

      // eslint-disable-next-line no-console
      console.log(`Created new ${planKey} yearly plan`);
    }
  } catch (error) {
    console.error(`Error creating/updating ${planKey} plan:`, error);
    throw error;
  }
}

export const initializePlans = async () => {
  try {
    for (const [planKey, planData] of Object.entries(PLANS)) {
      await createOrUpdateStripePlan(planKey, planData);
    }
  } catch (error) {
    console.error("Error initializing plans:", error);
    process.exit(1);
  }
};
