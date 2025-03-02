import { errorHandler } from "@/lib/error-handler";
import * as timeSlotService from "../services/time-slot.service";

export const createTimeSlot = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const timeSlot = await timeSlotService.createTimeSlot(
      restaurantId,
      req.body
    );

    res.status(201).json(timeSlot);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateTimeSlot = async (req, res) => {
  try {
    const { timeSlotId } = req.params;

    const timeSlot = await timeSlotService.updateTimeSlot(timeSlotId, req.body);

    res.json(timeSlot);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, guestCount } = req.query;

    const timeSlots = await timeSlotService.getAvailableTimeSlots(
      req.params.restaurantId,
      date,
      parseInt(guestCount)
    );

    res.json(timeSlots);
  } catch (error) {
    errorHandler(error, res);
  }
};
