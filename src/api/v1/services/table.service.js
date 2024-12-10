import { prisma } from '../prisma/prisma';

export const getAllTables = async (restaurantId) => {
  return await prisma.table.findMany({
    where: { restaurantId },
  });
};