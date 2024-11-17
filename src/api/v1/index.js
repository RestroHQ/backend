import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    version: "1.0.0",
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

export const v1Router = router;
