import { Router } from "express";
import * as menuController from "../controllers/menu.controller";
import {
  authenticateStaff,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createMenuItemSchema,
  createMenuSchema,
  updateMenuItemSchema,
  updateMenuSchema,
} from "../schemas/menu.schema";
import {
  checkResourceLimit,
  validateSubscription,
} from "../middlewares/subscription.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticateStaff,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CASHIER", "WAITER", "CHEF"]),
  menuController.getAllMenus
);

router.get("/:menuId", menuController.getMenuById);

router.post(
  "/",
  authenticateStaff,
  validate(createMenuSchema),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validateSubscription,
  checkResourceLimit("menus"),
  menuController.createMenu
);

router.patch(
    "/:menuId",
    authenticateStaff,
    validate(updateMenuSchema),
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.updateMenu
  );

  router.delete(
    "/:menuId",
    authenticateStaff,
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.deleteMenu
  );

  router.post(
    "/:menuId/items",
    authenticateStaff,
    validate(createMenuItemSchema),
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.createMenuItem
  );