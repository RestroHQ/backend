const prisma = require("../../../lib/prisma");

// Service to create a menu category
const createMenuCategory = async (data) => {
  return prisma.menuCategory.create({ data });
};

// Service to get menu categories for a restaurant
const getMenuCategoriesByRestaurant = async (restaurantId) => {
  return prisma.menuCategory.findMany({ where: { restaurantId } });
};

// Service to create a menu item
const createMenuItem = async (data) => {
  return prisma.menuItem.create({ data });
};

// Service to get menu items by category
const getMenuItemsByCategory = async (categoryId) => {
  return prisma.menuItem.findMany({ where: { categoryId } });
};

module.exports = {
  createMenuCategory,
  getMenuCategoriesByRestaurant,
  createMenuItem,
  getMenuItemsByCategory,
};
