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

export const getMenuById = async (id) => {
  const menu = await prisma.menu.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      menuItems: {
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

  if (!menu) {
    throw new Error("Menu not found");
  }

  generateMenuImageUrls([menu]);

  return menu;
};

export const createMenu = async (data) => {
  const { name, description, isActive, menuItems, restaurantId } = data;

  const menu = await prisma.menu.create({
    data: {
      name,
      description,
      isActive,
      restaurantId,
    },
    include: {
      menuItems: true,
    },
  });

  if (menuItems && menuItems.length > 0) {
    await prisma.menuItem.createMany({
      data: menuItems.map((item) => ({
        ...item,
        menuId: menu.id,
      })),
    });
  }

  const menuWithItems = await prisma.menu.findUnique({
    where: { id: menu.id },
    include: { menuItems: true },
  });

  return menuWithItems;
};

export const updateMenu = async (id, data) => {
  const menu = await prisma.menu.update({
    where: { id },
    data,
    include: {
      menuItems: true,
    },
  });

  generateMenuImageUrls([menu]);

  return menu;
};

export const deleteMenu = async (id) => {
  const deletedMenu = await softDelete("menu", id);
  return deletedMenu;
};

export const restoreMenu = async (id) => {
  const restoredMenu = await restore("menu", id);
  return restoredMenu;
};

export const createMenuItem = async (data) => {
  const menuItem = await prisma.menuItem.create({
    data,
  });

  if (menuItem.imageUrl) {
    menuItem.imageUrl = await generateDownloadUrl(menuItem.imageUrl);
  }

  return menuItem;
};

export const updateMenuItem = async (id, data) => {
  const menuItem = await prisma.menuItem.update({
    where: { id },
    data,
  });

  if (menuItem.imageUrl) {
    menuItem.imageUrl = await generateDownloadUrl(menuItem.imageUrl);
  }

  return menuItem;
};

export const deleteMenuItem = async (id) => {
  await prisma.menuItem.delete({
    where: { id },
  });
  return { message: "Menu item deleted successfully" };
};