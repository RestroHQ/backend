import { errorHandler } from '@/lib/error-handler';
import * as reservationService from '../services/reservation.service';


export const getReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = await reservationService.getReservations(restaurantId);
    res.status(200).json(reservations);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createReservation = async (req, res) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.updateReservation(id, req.body);
    res.status(200).json(reservation);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await reservationService.deleteReservation(id);
    res.status(204).send();
  } catch (error) {
    errorHandler(error, res);
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, guests } = req.query;
    const availability = await reservationService.checkAvailability(restaurantId, date, guests);
    res.status(200).json(availability);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getCapacity = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const capacity = await reservationService.calculateCapacity(restaurantId);
    res.status(200).json(capacity);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const manageWaitlist = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, guests, userId, timeSlotId } = req.body; 
    const waitlistEntry = await reservationService.manageWaitlist({
      restaurantId,
      date,
      guests,
      userId,
      timeSlotId,
    });
    res.status(201).json(waitlistEntry); 
  } catch (error) {
    errorHandler(error, res);
  }
};
