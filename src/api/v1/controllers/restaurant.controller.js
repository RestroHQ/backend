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
    const { restaurantId } = req.params;

    const restaurant = await restaurantService.updateRestaurant(
      restaurantId,
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
    const { restaurantId } = req.params;

    const result = await restaurantService.deleteRestaurant(
      restaurantId,
      req.user.id
    );

    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await restaurantService.getRestaurantById(restaurantId);

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

export const addRestaurantStaff = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const staff = await restaurantService.addRestaurantStaff(
      restaurantId,
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
    const { restaurantId } = req.params;

    const result = await restaurantService.removeRestaurantStaff(
      restaurantId,
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

    const { restaurantId } = req.params;

    const result = await restaurantService.getRestaurantStaff(
      restaurantId,
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
