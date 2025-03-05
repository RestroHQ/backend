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

export const getMenuById = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menu = await menuService.getMenuById(menuId);
    res.json(menu);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const data = { ...req.body, restaurantId };

    const menu = await menuService.createMenu(data);

    res.status(201).json(menu);
  } catch (error) {
    errorHandler(error, res);
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
