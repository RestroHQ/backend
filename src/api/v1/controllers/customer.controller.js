import { errorHandler } from "@/lib/error-handler";
import * as customerService from "../services/customer.service";

export const registerCustomer = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await customerService.registerCustomer({
      ...req.body,
      restaurantId,
    });
    res.status(201).json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await customerService.loginCustomer(email, password);
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await customerService.getCustomers(restaurantId, req.query);
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.params;

    const customer = await customerService.getCustomerById(
      customerId,
      restaurantId
    );
    res.json(customer);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await customerService.updateCustomer(customerId, req.body);

    res.json(customer);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const result = await customerService.deleteCustomer(customerId);
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};
