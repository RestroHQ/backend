import { errorHandler } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma";

export const getPlans = async () => {
  const plans = await prisma.subscriptionPlan.findMany();

  return plans;
};
