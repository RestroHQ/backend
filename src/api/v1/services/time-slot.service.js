import { prisma } from "@/lib/prisma";

export const createTimeSlot = async (restaurantId, data) => {
  // Check for overlapping time slots
  const overlapping = await prisma.timeSlot.findFirst({
    where: {
      restaurantId,
      OR: [
        {
          AND: [
            { startTime: { lte: new Date(data.startTime) } },
            { endTime: { gt: new Date(data.startTime) } },
          ],
        },
        {
          AND: [
            { startTime: { lt: new Date(data.endTime) } },
            { endTime: { gte: new Date(data.endTime) } },
          ],
        },
      ],
    },
  });

  if (overlapping) {
    throw new Error("Time slot overlaps with existing slots");
  }

  return prisma.timeSlot.create({
    data: {
      ...data,
      restaurantId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  });
};

export const updateTimeSlot = async (id, data) => {
  const timeSlot = await prisma.timeSlot.findUnique({
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

  if (!timeSlot) {
    throw new Error("Time slot not found");
  }

  // If capacity is being reduced, check existing reservations
  if (data.capacity && data.capacity < timeSlot.capacity) {
    const currentReservations = timeSlot.reservations.length;
    if (currentReservations > data.capacity) {
      throw new Error("Cannot reduce capacity below current reservation count");
    }
  }

  return prisma.timeSlot.update({
    where: { id },
    data,
  });
};

export const getAvailableTimeSlots = async (restaurantId, date, guestCount) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    throw new Error("Invalid date provided");
  }

  const startOfDay = new Date(parsedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(parsedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      restaurantId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      isAvailable: true,
      ...(guestCount && { capacity: { gte: guestCount } }),
    },
    include: {
      reservations: {
        where: {
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        select: {
          guestCount: true,
        },
      },
    },
  });

  // Calculate remaining capacity for each time slot
  return timeSlots.map((slot) => {
    const reservedCapacity = slot.reservations.reduce(
      (sum, res) => sum + res.guestCount,
      0
    );
    return {
      ...slot,
      remainingCapacity: slot.capacity - reservedCapacity,
    };
  });
};
