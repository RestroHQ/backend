import * as restaurantService from "@/api/v1/services/restaurant.service";

export const createRestaurantHandler = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(
      req.validatedData,
      req.user.id,
    );
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateRestaurantHandler = async (req, res) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(
      req.params.id,
      req.validatedData,
      req.user.id,
    );
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteRestaurantHandler = async (req, res) => {
  try {
    const result = await restaurantService.deleteRestaurant(
      req.params.id,
      req.user.id,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRestaurantHandler = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurant(req.params.id);
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listRestaurantsHandler = async (req, res) => {
  try {
    const restaurants = await restaurantService.listRestaurants(req.query);
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
