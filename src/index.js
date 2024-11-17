import express from "express";
import cors from "cors";
import { config } from "@/lib/config";
import { v1Router } from "@/api/v1";
import { calcUptime } from "./lib/lib";

const app = express();
const port = config.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.use("/api/v1", v1Router);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
