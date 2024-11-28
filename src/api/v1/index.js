import { Router } from "express";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { restaurantRouter } from "./routes/restaurant.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    version: "1.0.0",
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/restaurants", restaurantRouter);

export const v1Router = router;
