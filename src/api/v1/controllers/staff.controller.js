import { errorHandler } from "@/lib/error-handler";
import * as staffService from "@/api/v1/services/staff.service";

export const addRestaurantStaff = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const staff = await staffService.addRestaurantStaff(
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

    const result = await staffService.removeRestaurantStaff(
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

    const result = await staffService.getRestaurantStaff(
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
