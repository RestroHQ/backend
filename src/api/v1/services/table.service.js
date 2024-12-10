import { prisma } from '../prisma/prisma';

export const getAllTables = async (restaurantId) => {
  return await prisma.table.findMany({
    where: { restaurantId },
  });
};

export const createTable = async (restaurantId, data) => {
    return await prisma.table.create({
      data: {
        ...data,
        restaurantId,
      },
    });
  };

  export const updateTable = async (tableId, data) => {
    return await prisma.table.update({
      where: { id: tableId },
      data,
    });
  };

  export const deleteTable = async (tableId) => {
    return await prisma.table.delete({
      where: { id: tableId },
    });
  };