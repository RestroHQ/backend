import { Router } from "express";
import { authRouter } from "./routes/auth.routes";
import { fileRouter } from "./routes/file.routes";
import { restaurantRouter } from "./routes/restaurant.routes";
import { userRouter } from "./routes/user.routes";

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
router.use("/files", fileRouter);

// NOTE: Moved other routes to the `restaurant.routes.js` file

export const v1Router = router;
