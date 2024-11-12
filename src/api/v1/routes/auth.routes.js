import {
  getProfile,
  loginUser,
  registerUser,
} from "@/api/v1/controllers/auth.controller";
import { authenticate, authorize } from "@/api/v1/middlewares/auth.middleware";
import { validateRequest } from "@/api/v1/middlewares/validate.middleware";
import { loginSchema, registerSchema } from "@/api/v1/schemas/auth.schema";

import { Router } from "express";

export const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/profile", authenticate, getProfile);
router.get("/admin", authenticate, authorize(["ADMIN"]), (req, res) => {
  res.json({ message: "Admin access granted" });
});
