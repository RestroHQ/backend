import express from "express";
import * as s3Controller from "../controllers/s3.controller";

const router = express.Router();

router.post("/upload", s3Controller.getUploadUrl);

router.get("/download/:fileName", s3Controller.getDownloadUrl);

router.post("/batch-download", s3Controller.getBatchDownloadUrls);

export const fileRouter = router;
