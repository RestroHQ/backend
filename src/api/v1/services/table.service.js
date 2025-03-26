import { prisma } from "@/lib/prisma";

export const createTable = async (restaurantId, data) => {
  return prisma.table.create({
    data: {
      ...data,
      restaurantId,
    },
  });
};

export const updateTable = async (id, data) => {
  const table = await prisma.table.findUnique({
    where: { id },
    include: {
      reservations: {
        where: {
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      },
    },
  });

  if (!table) {
    throw new Error("Table not found");
  }

  // Check if table can be made unavailable
  if (data.isAvailable === false && table.reservations.length > 0) {
    throw new Error(
      "Cannot make table unavailable - has upcoming reservations"
    );
  }

  return prisma.table.update({
    where: { id },
    data,
  });
};

export const getAvailableTables = async (restaurantId, timeSlotId, guestCount) => {
  if (!timeSlotId) {
    throw new Error("timeSlotId is required but was not provided");
  }

  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!timeSlot) {
    throw new Error("Time slot not found");
  }

  const tables = await prisma.table.findMany({
    where: {
      restaurantId,
      isAvailable: true,
      capacity: {
        gte: guestCount,
      },
      NOT: {
        reservations: {
          some: {
            timeSlotId,
            status: {
              in: ["PENDING", "CONFIRMED"],
            },
          },
        },
      },
    },
    orderBy: {
      capacity: "asc",
    },
  });

  return tables;
};
