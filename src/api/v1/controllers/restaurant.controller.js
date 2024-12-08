import { errorHandler } from "@/lib/error-handler";
import * as restaurantService from "@/api/v1/services/restaurant.service";

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
      req.params.id,
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
      req.params.id,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.json(restaurant);
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

    const result = await restaurantService.getUserRestaurants(req.user.id, {
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

export const addRestaurantStaff = async (req, res) => {
  try {
    const staff = await restaurantService.addRestaurantStaff(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(201).json(staff);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removeRestaurantStaff = async (req, res) => {
  try {
    const result = await restaurantService.removeRestaurantStaff(
      req.params.id,
      req.params.userId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurantStaff = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "joinedAt",
      sortOrder = "desc",
    } = req.query;

    const result = await restaurantService.getRestaurantStaff(
      req.params.id,
      req.user.id,
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
