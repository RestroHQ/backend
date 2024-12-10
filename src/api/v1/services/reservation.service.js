import { prisma } from '../prisma/prisma';


export const createReservation = async (data) => {
  try {

    if (!data.restaurantId || !data.tableId || !data.userId || !data.timeSlotId || !data.guestCount) {
      throw new Error("Missing required reservation fields: restaurantId, tableId, userId, timeSlotId, and guestCount.");
    }

    
    const table = await prisma.table.findUnique({
      where: { id: data.tableId },
      include: { reservations: true },
    });

    if (!table) {
      throw new Error("Table not found.");
    }

  
    const conflictingReservations = table.reservations.filter((reservation) => {
      return (
        reservation.timeSlotId === data.timeSlotId && reservation.status !== 'CANCELLED'
      );
    });

    if (conflictingReservations.length > 0) {
      throw new Error("The selected table is already booked for this time slot.");
    }

    
    return await prisma.reservation.create({
      data,
    });
  } catch (error) {
    throw new Error("Error creating reservation: " + error.message);
  }
};


export const getReservations = async (restaurantId) => {
  try {
    return await prisma.reservation.findMany({
      where: { restaurantId },
      include: { table: true, user: true },
    });
  } catch (error) {
    throw new Error("Error fetching reservations: " + error.message);
  }
};


export const updateReservation = async (reservationId, data) => {
  try {
    // Check if the reservation exists
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    
    if (data.timeSlotId) {
      const conflictingReservations = await prisma.reservation.findMany({
        where: {
          tableId: reservation.tableId,
          timeSlotId: data.timeSlotId,
          status: { not: 'CANCELLED' },
        },
      });

      if (conflictingReservations.length > 0) {
        throw new Error("The selected time slot is already booked.");
      }
    }

    return await prisma.reservation.update({
      where: { id: reservationId },
      data,
    });
  } catch (error) {
    throw new Error("Error updating reservation: " + error.message);
  }
};


export const deleteReservation = async (reservationId) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    return await prisma.reservation.delete({
      where: { id: reservationId },
    });
  } catch (error) {
    throw new Error("Error deleting reservation: " + error.message);
  }
};


export const checkAvailability = async (restaurantId, date, guests) => {
    try {
      const availableTables = await prisma.table.findMany({
        where: {
          restaurantId,
          capacity: { gte: guests },
          reservations: {
            none: {
              timeSlot: {
                startTime: { lte: new Date(date) },
                endTime: { gte: new Date(date) },
              },
              status: { not: 'CANCELLED' },
            },
          },
        },
      });
  
      return availableTables.length > 0;
    } catch (error) {
      throw new Error("Error checking availability: " + error.message);
    }
  };

  export const calculateCapacity = async (restaurantId) => {
    try {
      const tables = await prisma.table.findMany({
        where: { restaurantId },
        select: { capacity: true },
      });
  
      return tables.reduce((sum, table) => sum + table.capacity, 0);
    } catch (error) {
      throw new Error("Error calculating capacity: " + error.message);
    }
  };