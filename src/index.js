import { config } from "@/lib/config";
import { calcUptime } from "@/lib/utils";
import cors from "cors";
import express from "express";
import { apiRouter } from "./api";
import { seedDB } from "./lib/seed";

const app = express();
const port = config.PORT || 4000;

app.use(cors());
app.use(express.json());

seedDB();

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
  console.log(`Server is running on port http://localhost:${port}`);
});
