import * as restaurantService from "@/api/v1/services/restaurant.service";
import { errorHandler } from "@/lib/error-handler";

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.body,
      req.user.id
    );
    res.status(201).json(restaurant);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(
      req.params.restaurantId,
      req.body,
      req.user.id
    );
    res.json(restaurant);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const result = await restaurantService.deleteRestaurant(
      req.params.restaurantId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(
      req.params.restaurantId
    );
    res.json(restaurant);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const result = await restaurantService.getRestaurants(req.user, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });

    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getUserRestaurants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const result = await restaurantService.getUserRestaurants(req.user, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });

    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};
