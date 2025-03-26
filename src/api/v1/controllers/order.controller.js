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


export const updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await orderService.updateOrderStatus(
        orderId,
        status,
        req.user
      );
  
      res.json(order);
    } catch (error) {
      errorHandler(error, res);
    }
  };


export const getOrders = async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      const orders = await orderService.getOrders(restaurantId, req.query);
  
      res.json(orders);
    } catch (error) {
      errorHandler(error, res);
    }
  };
  