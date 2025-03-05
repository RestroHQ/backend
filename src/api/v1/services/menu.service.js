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

export const getAllMenus = async (restaurantId) => {
  const menus = await prisma.menu.findMany({
    where: {
      restaurantId,
      deletedAt: null,
    },
    include: {
      menuItems: {
        where: {
          isAvailable: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          isAvailable: true,
        },
      },
    },
  });

  generateMenuImageUrls(menus);

  return menus;
};

