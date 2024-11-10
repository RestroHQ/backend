import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export const v1Router = router;
