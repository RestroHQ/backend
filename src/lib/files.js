import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export const createUploadDirs = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "users"), { recursive: true });
  } catch (error) {
    console.error("Error creating upload directories:", error);
  }
};

export const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = path.extname(originalName);

  return `${timestamp}-${randomString}${extension}`;
};

export const saveFile = async (folder, id, file) => {
  const fileName = generateFileName(file.originalname);
  const userDir = path.join(UPLOAD_DIR, folder, id.toString());
  await fs.mkdir(userDir, { recursive: true });

  const filePath = path.join(userDir, fileName);
  await fs.writeFile(filePath, file.buffer);

  return `/files/${folder}/${id}/${fileName}`;
};

export const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath.replace("/files/", ""));
    await fs.unlink(fullPath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
