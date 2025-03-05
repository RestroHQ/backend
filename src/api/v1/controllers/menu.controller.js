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


export const updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const data = req.body;
    const menu = await menuService.updateMenu(menuId, data);
    res.json(menu);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    await menuService.deleteMenu(menuId);
    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};