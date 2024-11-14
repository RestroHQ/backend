import { Router } from "express";

import { router as authRouter } from "./auth.routes";
import { router as restaurantRouter } from "./restaurant.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use("/auth", authRouter);
router.use("/restaurants", restaurantRouter);

export const v1Router = router;
