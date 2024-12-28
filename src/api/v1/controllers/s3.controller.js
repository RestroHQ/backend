import * as s3Service from "../services/s3.service";

const MAX_FILE_SIZES = {
  AVATAR: 2 * 1024 * 1024,
  LOGO: 5 * 1024 * 1024,
  COVER: 10 * 1024 * 1024,
  MENU_ITEM: 5 * 1024 * 1024,
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const validateFileUpload = (fileSize, mimeType, type) => {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error("Invalid file type. Only JPEG, PNG and WebP are allowed.");
  }

  if (fileSize > MAX_FILE_SIZES[type]) {
    throw new Error(
      `File size exceeds maximum limit of ${MAX_FILE_SIZES[type] / (1024 * 1024)}MB for ${type.toLowerCase()}`
    );
  }
};

export const getUploadUrl = async (req, res) => {
  try {
    const { fileName, contentType, fileSize, type, entityId, metadata } =
      req.body;

    if (!fileName || !contentType || !fileSize || !type || !entityId) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide fileName, contentType, fileSize, type, and entityId",
      });
    }

    validateFileUpload(fileSize, contentType, type);

    const {
      uploadUrl,
      fileName: uniqueFileName,
      path,
    } = await s3Service.generateUploadUrl({
      fileName,
      contentType,
      fileSize,
      type: type.toUpperCase(),
      entityId,
      metadata,
    });

    res.json({
      uploadUrl,
      fileName: uniqueFileName,
      path,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Upload URL generation error:", error);

    if (
      error.message.includes("File size exceeds") ||
      error.message.includes("Invalid file type") ||
      error.message.includes("Invalid image type") ||
      error.message.includes("entityId is required")
    ) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
};

export const getDownloadUrl = async (req, res) => {
  try {
    const { fileName } = req.params;
    const { expiry } = req.query;

    const expiryTime = Number(expiry) || 3600;

    if (expiryTime > 604800) {
      return res.status(400).json({
        error: "Expiry time cannot exceed 7 days",
      });
    }

    const downloadUrl = await s3Service.generateDownloadUrl(
      fileName,
      expiryTime
    );

    res.json({
      downloadUrl,
      expiresIn: expiryTime,
    });
  } catch (error) {
    console.error("Download URL generation error:", error);
    res.status(500).json({
      error: "Failed to generate download URL",
    });
  }
};

export const getBatchDownloadUrls = async (req, res) => {
  try {
    const { fileNames } = req.body;
    const { expiry } = req.query;

    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      return res.status(400).json({
        error: "fileNames must be a non-empty array",
      });
    }

    if (fileNames.length > 50) {
      return res.status(400).json({
        error: "Maximum 50 files can be requested at once",
      });
    }

    const expiryTime = Number(expiry) || 3600;
    if (expiryTime > 604800) {
      return res.status(400).json({
        error: "Expiry time cannot exceed 7 days",
      });
    }

    const urlPromises = fileNames.map(async (fileName) => ({
      fileName,
      downloadUrl: await s3Service.generateDownloadUrl(fileName, expiryTime),
    }));

    const urls = await Promise.all(urlPromises);

    res.json({
      urls,
      expiresIn: expiryTime,
    });
  } catch (error) {
    console.error("Batch download URLs generation error:", error);
    res.status(500).json({
      error: "Failed to generate download URLs",
    });
  }
};
