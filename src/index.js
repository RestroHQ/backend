import { fileRouter } from "@/api/v1/routes/file.routes";
import { config } from "@/lib/config";
import { createUploadDirs } from "@/lib/files";
import { calcUptime } from "@/lib/utils";
import cors from "cors";
import express from "express";
import { apiRouter } from "./api";

const app = express();
const port = config.PORT || 4000;

app.use(cors());
app.use(express.json());

createUploadDirs();

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
app.use(fileRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
