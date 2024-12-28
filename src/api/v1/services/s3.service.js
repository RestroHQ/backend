import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const IMAGE_PATHS = {
  AVATAR: (userId) => `users/${userId}/avatars`,
  COVER: (restaurantId) => `restaurants/${restaurantId}/covers`,
  LOGO: (restaurantId) => `restaurants/${restaurantId}/logos`,
  MENU_ITEM: (menuId) => `menus/${menuId}/items`,
};

const generateUniqueFileName = (originalName, type, entityId) => {
  const timestamp = Date.now();
  const randomString = createId();
  const extension = path.extname(originalName);
  const folder = IMAGE_PATHS[type](entityId);

  return `${folder}/${timestamp}-${randomString}${extension}`;
};

export const generateUploadUrl = async ({
  fileName,
  contentType,
  type,
  entityId,
  metadata = {},
}) => {
  if (!entityId) {
    throw new Error("entityId is required");
  }

  if (!IMAGE_PATHS[type]) {
    throw new Error(`Invalid image type: ${type}`);
  }

  const uniqueFileName = generateUniqueFileName(fileName, type, entityId);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: uniqueFileName,
    ContentType: contentType,
    Metadata: {
      entityId: entityId.toString(),
      uploadType: type.toLowerCase(),
      ...metadata,
    },
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      uploadUrl: signedUrl,
      fileName: uniqueFileName,
      path: uniqueFileName,
    };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw new Error("Failed to generate upload URL");
  }
};

export const generateDownloadUrl = async (fileName, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw new Error("Failed to generate download URL");
  }
};
