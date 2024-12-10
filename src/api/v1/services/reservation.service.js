import { prisma } from '../prisma/prisma';

export const createReservation = async (data) => {
  return await prisma.reservation.create({ data });
};

export const getReservations = async (restaurantId) => {
    return await prisma.reservation.findMany({
      where: { restaurantId },
      include: { table: true, user: true },
    });
  };
  
  export const updateReservation = async (reservationId, data) => {
    return await prisma.reservation.update({
      where: { id: reservationId },
      data,
    });
  };
  
  export const deleteReservation = async (reservationId) => {
    return await prisma.reservation.delete({
      where: { id: reservationId },
    });
  };