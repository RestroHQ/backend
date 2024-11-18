import { UPLOAD_DIR } from "@/lib/files";
import express from "express";
import path from "path";

const router = express.Router();

router.get("/files/:type/:id/:filename", (req, res) => {
  const { type, id, filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, type, id, filename);
  res.sendFile(filePath);
});

export const fileRouter = router;
