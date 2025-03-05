import { prisma } from "@/lib/prisma";
import { generateDownloadUrl } from "./s3.service";
import { restore, softDelete } from "./base.service";
import { config } from "@/lib/config";

const generateMenuImageUrls = (menus) => {
  menus.forEach((menu) => {
    menu.menuItems.forEach(async (item) => {
      if (item.imageUrl) {
        item.imageUrl = await generateDownloadUrl(
          item.imageUrl,
          config.EXPIRY_IN_SECONDS
        );
      }
    });
  });
};
