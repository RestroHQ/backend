import { errorHandler } from "@/lib/error-handler";
import * as reservationService from "../services/reservation.service";

export const createReservation = async (req, res) => {
  try {
    const { id: customerId } = req.customer;
    const { id: userId } = req.user;
    const { restaurantId } = req.params;

    const data = {
      ...req.body,
      restaurantId,
    };

    const reservation = await reservationService.createReservation(
      req.body,
      req.user.id
    );
    res.status(201).json(reservation);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { id: userId } = req.user;

    const reservation = await reservationService.updateReservation(
      reservationId,
      req.body,
      userId
    );
    res.json(reservation);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getReservationById = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { id: userId } = req.user;

    const reservation = await reservationService.getReservationById(
      reservationId,
      userId
    );
    res.json(reservation);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getCustomerReservations = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;
    const { id: customerId } = req.customer;

    const result = await reservationService.getCustomerReservations(
      customerId,
      {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      }
    );
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurantReservations = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, status } = req.query;
    const { restaurantId } = req.params;

    const result = await reservationService.getRestaurantReservations(
      restaurantId,
      {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        status,
      }
    );
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};
