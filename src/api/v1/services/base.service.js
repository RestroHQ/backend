import { prisma } from "@/lib/prisma";

export const softDelete = async (model, id) => {
  return prisma[model].update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
};

export const restore = async (model, id) => {
  return prisma[model].update({
    where: { id },
    data: {
      deletedAt: null,
      isActive: true,
    },
  });
};
