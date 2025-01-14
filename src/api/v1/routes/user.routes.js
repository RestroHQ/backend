import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, authorize(["ADMIN"]), userController.getAllUsers);
router.get("/me", authenticate, userController.getCurrentUser);
router.get(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  userController.getUserById
);
router.patch("/:id", authenticate, userController.updateUser);
router.patch(
  "/:id/role",
  authenticate,
  authorize(["ADMIN"]),
  userController.updateUserRole
);
router.delete("/:id", authenticate, userController.deleteUser);
router.patch(
  "/:id/restore",
  authenticate,
  authorize(["ADMIN"]),
  userController.restoreUser
);

export const userRouter = router;
