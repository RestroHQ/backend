import { Router } from "express";
import * as menuController from "../controllers/menu.controller";
import {
  authenticate,
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
  authenticate,
  authorizeRestaurantRole(["OWNER", "MANAGER", "CASHIER", "WAITER", "CHEF"]),
  menuController.getAllMenus
);

router.get("/:menuId", menuController.getMenuById);

router.post(
  "/",
  authenticate,
  validate(createMenuSchema),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validateSubscription,
  checkResourceLimit("menus"),
  menuController.createMenu
);

router.patch(
    "/:menuId",
    authenticate,
    validate(updateMenuSchema),
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.updateMenu
  );

  router.delete(
    "/:menuId",
    authenticate,
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.deleteMenu
  );

  router.post(
    "/:menuId/items",
    authenticate,
    validate(createMenuItemSchema),
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.createMenuItem
  );

  router.patch(
    "/:menuId/items/:itemId",
    authenticate,
    validate(updateMenuItemSchema),
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.updateMenuItem
  );
  
  router.delete(
    "/:menuId/items/:itemId",
    authenticate,
    authorizeRestaurantRole(["OWNER", "MANAGER"]),
    menuController.deleteMenuItem
  );
  
  export const menuRouter = router;
  