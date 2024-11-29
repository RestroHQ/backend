import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  userController.getAllUsers
);
router.get("/me", authenticate, userController.getCurrentUser);
router.get(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  userController.getUserById
);
router.put("/:id", authenticate, userController.updateUser);
router.put(
  "/:id/role",
  authenticate,
  authorize(["SUPERADMIN"]),
  userController.updateUserRole
);
router.delete("/:id", authenticate, userController.deleteUser);
router.put(
  "/:id/restore",
  authenticate,
  authorize(["SUPERADMIN"]),
  userController.restoreUser
);

export const userRouter = router;
