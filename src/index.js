import express from "express";
import cors from "cors";
import { config } from "@/utils/config";

const app = express();
const port = config.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
