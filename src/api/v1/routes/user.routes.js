import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticateStaff, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticateStaff,
  authorize(["ADMIN"]),
  userController.getAllUsers
);
router.get("/me", authenticateStaff, userController.getCurrentUser);
router.get(
  "/:id",
  authenticateStaff,
  authorize(["ADMIN"]),
  userController.getUserById
);
router.patch("/:id", authenticateStaff, userController.updateUser);
router.patch(
  "/:id/role",
  authenticateStaff,
  authorize(["ADMIN"]),
  userController.updateUserRole
);
router.delete("/:id", authenticateStaff, userController.deleteUser);
router.patch(
  "/:id/restore",
  authenticateStaff,
  authorize(["ADMIN"]),
  userController.restoreUser
);

export const userRouter = router;
