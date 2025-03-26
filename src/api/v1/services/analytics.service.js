import { prisma } from "@/lib/prisma";

export const getUserAnalytics = async (restaurantId) => {
  const [
    totalUsers,
    activeUsers,
    roleDistribution,
    totalCustomers,
    activeCustomers,
  ] = await Promise.all([
    prisma.restaurantStaff.count({
      where: { restaurantId },
    }),
    prisma.restaurantStaff.count({
      where: {
        restaurantId,
        user: { isActive: true },
      },
    }),
    prisma.restaurantStaff.groupBy({
      by: ["role"],
      where: { restaurantId },
      _count: true,
    }),
    prisma.customer.count({
      where: { restaurantId },
    }),
    prisma.customer.count({
      where: {
        restaurantId,
        isActive: true,
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      roleDistribution,
    },
    customers: {
      total: totalCustomers,
      active: activeCustomers,
      inactive: totalCustomers - activeCustomers,
    },
  };
};

export const getOrderAnalytics = async (restaurantId, startDate, endDate) => {
  if (!startDate) {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
  }
  if (!endDate) {
    endDate = new Date();
  }

  const dateFilter = {
    createdAt: {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    },
  };

  const [totalOrders, revenue, averageOrderValue, topMenuItems, topCustomers] =
    await Promise.all([
      prisma.order.count({
        where: {
          restaurantId,
          ...dateFilter,
        },
      }),
      prisma.order.aggregate({
        where: {
          restaurantId,
          status: "COMPLETED",
          ...dateFilter,
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          restaurantId,
          status: "COMPLETED",
          ...dateFilter,
        },
        _avg: {
          total: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ["menuItemId"],
        where: {
          order: {
            restaurantId,
            ...dateFilter,
          },
        },
        _count: true,
        _sum: {
          quantity: true,
          totalPrice: true,
        },
      }),
      prisma.order.groupBy({
        by: ["createdById"],
        where: {
          restaurantId,
          createdByType: "CUSTOMER",
          ...dateFilter,
        },
        _count: true,
        _sum: {
          total: true,
        },
      }),
    ]);

  return {
    orders: {
      total: totalOrders,
      revenue: revenue._sum.total || 0,
      averageOrderValue: averageOrderValue._avg.total || 0,
      topMenuItems: await Promise.all(
        topMenuItems.map(async (item) => {
          const menuItem = await prisma.menuItem.findUnique({
            where: { id: item.menuItemId },
            select: { name: true },
          });
          return {
            name: menuItem?.name,
            count: item._count,
            quantity: item._sum.quantity,
            revenue: item._sum.totalPrice,
          };
        })
      ),
      topCustomers: await Promise.all(
        topCustomers.map(async (customer) => {
          const customerDetails = await prisma.customer.findUnique({
            where: { id: customer.createdById },
            select: { name: true, email: true },
          });
          return {
            ...customerDetails,
            orderCount: customer._count,
            totalSpent: customer._sum.total,
          };
        })
      ),
    },
  };
};

export const getStaffAnalytics = async (restaurantId) => {
  const [staffCount, staffActivity, staffRetention] = await Promise.all([
    prisma.restaurantStaff.count({
      where: { restaurantId },
    }),
    prisma.order.groupBy({
      by: ["createdById"],
      where: {
        restaurantId,
        createdByType: "STAFF",
      },
      _count: true,
    }),
    prisma.restaurantStaff.groupBy({
      by: ["joinedAt"],
      where: { restaurantId },
      _count: true,
    }),
  ]);

  return {
    staff: {
      total: staffCount,
      activity: await Promise.all(
        staffActivity.map(async (staff) => {
          const staffMember = await prisma.restaurantStaff.findUnique({
            where: { id: staff.createdById },
            include: { user: { select: { name: true, email: true } } },
          });
          return {
            ...staffMember?.user,
            ordersProcessed: staff._count,
          };
        })
      ),
      retention: staffRetention,
    },
  };
};

export const getCustomerBehaviorAnalytics = async (restaurantId) => {
  const [customerOrders, customerRatings, averageSpending] = await Promise.all([
    prisma.order.groupBy({
      by: ["createdById"],
      where: {
        restaurantId,
        createdByType: "CUSTOMER",
      },
      _count: true,
      _sum: {
        total: true,
      },
    }),
    prisma.review.groupBy({
      by: ["customerId"],
      where: { restaurantId },
      _avg: {
        rating: true,
      },
      _count: true,
    }),
    prisma.order.aggregate({
      where: {
        restaurantId,
        createdByType: "CUSTOMER",
      },
      _avg: {
        total: true,
      },
    }),
  ]);

  return {
    customerBehavior: {
      orderFrequency: await Promise.all(
        customerOrders.map(async (customer) => {
          const customerDetails = await prisma.customer.findUnique({
            where: { id: customer.createdById },
            select: { name: true, email: true },
          });
          return {
            ...customerDetails,
            orderCount: customer._count,
            totalSpent: customer._sum.total,
          };
        })
      ),
      ratings: await Promise.all(
        customerRatings.map(async (rating) => {
          const customer = await prisma.customer.findUnique({
            where: { id: rating.customerId },
            select: { name: true, email: true },
          });
          return {
            ...customer,
            averageRating: rating._avg.rating,
            reviewCount: rating._count,
          };
        })
      ),
      averageSpending: averageSpending._avg.total || 0,
    },
  };
};
