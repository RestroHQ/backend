import { errorHandler } from "@/lib/error-handler";
import * as posService from "../services/pos.service";

export const createOrder = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user.id;
    const data = req.body;

    const order = await posService.createPosOrder(restaurantId, userId, data);

    res.status(201).json(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const data = req.body;

    const order = await posService.processPayment(orderId, data);

    res.json(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const voidOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const data = req.body;

    const order = await posService.voidOrder(orderId, userId, data);

    res.json(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;
    const data = req.body;

    const payment = await posService.refundPayment(paymentId, userId, data);

    res.json(payment);
  } catch (error) {
    errorHandler(error, res);
  }
};
