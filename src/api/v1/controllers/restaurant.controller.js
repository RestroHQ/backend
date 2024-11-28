import { errorHandler } from "@/lib/error-handler";
import * as restaurantService from "@/api/v1/services/restaurant.service";

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.body,
      req.user.id,
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
      req.user.id,
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
      req.user.id,
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
    const restaurants = await restaurantService.getUserRestaurants(req.user.id);
    res.json(restaurants);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const addRestaurantStaff = async (req, res) => {
  try {
    const staff = await restaurantService.addRestaurantStaff(
      req.params.id,
      req.body,
      req.user.id,
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
      req.user.id,
    );
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRestaurantStaff = async (req, res) => {
  try {
    const staff = await restaurantService.getRestaurantStaff(req.params.id);
    res.json(staff);
  } catch (error) {
    errorHandler(error, res);
  }
};
