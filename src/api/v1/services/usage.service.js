import { prisma } from "@/lib/prisma";

async function getMenuItemsCountPerMenu(restaurantId) {
  const menus = await prisma.menu.findMany({
    where: {
      restaurantId,
      isActive: true,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          menuItems: true,
        },
      },
    },
  });

  return menus.map((menu) => ({
    menuId: menu.id,
    menuName: menu.name,
    itemsCount: menu._count.menuItems,
  }));
}

export async function getUsage(restaurantId) {
  try {
    const [
      staffCount,
      menus,
      menuItemsPerMenu,
      tablesCount,
      reservationsCount,
      emailsListCount,
      customersCount,
      waitlistCount,
      ordersCount,
    ] = await Promise.all([
      prisma.restaurantStaff.count({
        where: { restaurantId },
      }),

      prisma.menu.count({
        where: {
          restaurantId,
          isActive: true,
          deletedAt: null,
        },
      }),

      getMenuItemsCountPerMenu(restaurantId),

      prisma.table.count({
        where: { restaurantId },
      }),

      prisma.reservation.count({
        where: {
          restaurantId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),

      prisma.emailsList.count({
        where: {
          restaurantId,
          isActive: true,
        },
      }),

      prisma.customer.count({
        where: {
          restaurantId,
          isActive: true,
          deletedAt: null,
        },
      }),

      prisma.waitlist.count({
        where: { restaurantId },
      }),

      prisma.order.count({
        where: {
          restaurantId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          isVoided: false,
        },
      }),
    ]);

    return {
      staff: staffCount,
      menus: menus,
      menuItems: menuItemsPerMenu,
      tables: tablesCount,
      reservations: reservationsCount,
      emailsList: emailsListCount,
      customers: customersCount,
      waitlist: waitlistCount,
      orders: ordersCount,
    };
  } catch (error) {
    console.error("Error getting restaurant usage:", error);
    throw new Error("Failed to get restaurant usage statistics");
  }
}
