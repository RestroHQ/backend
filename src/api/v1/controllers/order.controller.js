import { errorHandler } from "@/lib/error-handler";
import * as orderService from "../services/order.service";

export const createOrder = async (req, res) => {
  try {
    const creatorType = req.customer ? "CUSTOMER" : "STAFF";
    const creator = req.customer || req.user;

    const order = await orderService.createOrder(
      req.body,
      creator,
      creatorType
    );

    res.status(201).json(order);
  } catch (error) {
    errorHandler(error, res);
  }
};