import { config } from "@/lib/config";
import { calcUptime } from "@/lib/utils";

import cors from "cors";
import express from "express";
import winston from "winston";

import { apiRouter } from "./api";
import stripeWebhookHandler from "./api/v1/webhooks/stripe";
import { initializePlans } from "./lib/scripts/init-stripe-products";
import { seedAdmin } from "./lib/scripts/seed-admin";

const app = express();
const port = config.PORT || 4000;

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [new winston.transports.Console()],
});

app.use(cors());

app.post(
  "/api/v1/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

seedAdmin();
initializePlans();

app.get("/", (req, res) => {
  res.json({
    name: "RestroHQ API",
    description: "API for managing RestroHQ services",
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: calcUptime(),
    versions: {
      v1: "/api/v1",
    },
  });
});

app.use("/api", apiRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port http://localhost:${port}`);
});
