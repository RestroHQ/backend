import { prisma } from "@/lib/prisma";

export const createReservation = async (data, customerId, restaurantId) => {
  const timeSlot = await prisma.timeSlot.findFirst({
    where: {
      id: data.timeSlotId,
      restaurantId,
      isAvailable: true,
    },
  });

  if (!timeSlot) {
    throw new Error("Time slot is not available");
  }

  const table = await prisma.table.findFirst({
    where: {
      id: data.tableId,
      restaurantId,
      isAvailable: true,
      capacity: {
        gte: data.guestCount,
      },
    },
  });

  if (!table) {
    throw new Error("Table is not available or insufficient capacity");
  }

  // Check if customer belongs to the restaurant
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      restaurantId,
      isActive: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found or unauthorized");
  }

  const reservation = await prisma.reservation.create({
    data: {
      ...data,
      customerId,
      restaurantId,
      status: "PENDING",
    },
    include: {
      table: true,
      timeSlot: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return reservation;
};

export const updateReservation = async (id, data, customerId) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { customer: true },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  if (reservation.customerId !== customerId) {
    throw new Error("Unauthorized to update this reservation");
  }

  const updatedReservation = await prisma.reservation.update({
    where: { id },
    data,
    include: {
      table: true,
      timeSlot: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return updatedReservation;
};

export const getReservationById = async (id, customerId) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      table: true,
      timeSlot: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  if (reservation.customerId !== customerId) {
    throw new Error("Unauthorized to view this reservation");
  }

  return reservation;
};

export const getCustomerReservations = async (
  customerId,
  { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  const offset = (page - 1) * limit;

  try {
    const reservations = await prisma.reservation.findMany({
      where: { customerId },
      include: {
        table: true,
        timeSlot: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.reservation.count({ where: { customerId } });

    return {
      reservations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Failed to get customer reservations: ${error.message}`);
  }
};

export const getRestaurantReservations = async (
  restaurantId,
  {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
  } = {}
) => {
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const offset = (pageInt - 1) * limitInt;

  const where = { restaurantId };

  if (status) {
    where.status = status;
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        table: true,
        timeSlot: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limitInt, // Add the take parameter with the converted limit value
    });

    const total = await prisma.reservation.count({ where });

    return {
      reservations,
      pagination: {
        total,
        page: pageInt,
        limit: limitInt,
        totalPages: Math.ceil(total / limitInt),
      },
    };
  } catch (error) {
    throw new Error(`Failed to get restaurant reservations: ${error.message}`);
  }
};
