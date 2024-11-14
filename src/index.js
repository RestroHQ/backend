import express from "express";
import cors from "cors";
import { config } from "@/utils/config";
import { v1Router } from "@/api/v1/routes";
import { seedDatabase } from "./utils/seed";

const app = express();
const port = config.PORT || 3000;

app.use(cors());
app.use(express.json());

seedDatabase();

app.get("/", (req, res) => {
  res.json({
    name: "RestroHQ API",
    version: "1.0.0",
    description: "API for managing RestroHQ services",
    versions: {
      v1: "/api/v1",
    },
    status: "UP",
  });
});

app.use("/api/v1", v1Router);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
