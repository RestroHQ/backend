const express = require("express");
const menuController = require("../controllers/menu.controller");

const router = express.Router();

router.post("/menu-categories", menuController.createMenuCategory);
router.get(
  "/restaurants/:restaurantId/menu-categories",
  menuController.getMenuCategoriesByRestaurant
);
router.post("/menu-items", menuController.createMenuItem);
router.get(
  "/menu-categories/:categoryId/menu-items",
  menuController.getMenuItemsByCategory
);

module.exports = router;
