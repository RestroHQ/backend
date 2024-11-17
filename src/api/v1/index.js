import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "UP",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export const v1Router = router;
