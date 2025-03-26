import { prisma } from "@/lib/prisma";

export const createReservation = async (data) => {
  const timeSlot = await prisma.timeSlot.findFirst({
    where: {
      id: data.timeSlotId,
      restaurantId: data.restaurantId,
      isAvailable: true,
    },
  });

  if (!timeSlot) {
    throw new Error("Time slot is not available");
  }

  const table = await prisma.table.findFirst({
    where: {
      id: data.tableId,
      restaurantId: data.restaurantId,
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
      id: data.customerId,
      restaurantId: data.restaurantId,
      isActive: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found or unauthorized");
  }

  const reservation = await prisma.reservation.create({
    data: {
      guestCount: data.guestCount,
      notes: data?.notes,	
      status: "PENDING",
      restaurant: {
        connect: { id: data.restaurantId } // Ensure the restaurant is connected by its ID
      },
      table: {
        connect: { id: data.tableId } // Ensure the table is connected by its ID
      },
      customer: {
        connect: { id: data.customerId } // Ensure the customer is connected by its ID
      },
      timeSlot: {
        connect: { id: data.timeSlotId } // Ensure the time slot is connected by its ID
      },
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

export const updateReservation = async (id, data) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }


  const updatedReservation = await prisma.reservation.update({
    where: { id },
    data,
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

  return reservation;
};

export const getCustomerReservations = async (
  customerId,
  { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  const pageInt = parseInt(page, 10) || 1; // Ensure valid page number
  const limitInt = parseInt(limit, 10) || 10; // Ensure valid limit
  const offset = (pageInt - 1) * limitInt;

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
      take: limitInt, // Ensure the limit is passed as the take argument
    });

    const total = await prisma.reservation.count({ where: { customerId } });

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
  const pageInt = parseInt(page, 10) || 1; // Ensure valid page number
  const limitInt = parseInt(limit, 10) || 10; // Ensure valid limit
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
      take: limitInt, // Ensure the limit is passed as the take argument
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
