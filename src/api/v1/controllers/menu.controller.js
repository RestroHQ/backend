import { errorHandler } from "@/lib/error-handler";
import * as menuService from "../services/menu.service";

export const getAllMenus = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menus = await menuService.getAllMenus(restaurantId);
    res.json(menus);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Controller for fetching menu categories by restaurant
const getMenuCategoriesByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const categories =
      await menuService.getMenuCategoriesByRestaurant(restaurantId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// Controller for creating a menu item
const createMenuItem = async (req, res, next) => {
  try {
    const data = req.body;
    const item = await menuService.createMenuItem(data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Controller for fetching menu items by category
const getMenuItemsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const items = await menuService.getMenuItemsByCategory(categoryId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenuCategory,
  getMenuCategoriesByRestaurant,
  createMenuItem,
  getMenuItemsByCategory,
};
