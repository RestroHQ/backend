import { prisma } from "@/lib/prisma";
import { calculateOrderTotals } from "@/lib/utils";

export const createOrder = async (data, creator, creatorType) => {
  const { items, ...orderData } = data;

  // Fetch menu items to validate prices and availability
  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: items.map((item) => item.menuItemId) },
      isAvailable: true,
    },
  });

  if (menuItems.length !== items.length) {
    throw new Error("Some menu items are not available");
  }

  // Calculate order totals
  const { subtotal, tax, total } = calculateOrderTotals(items, menuItems);

  // Create order with items
  const order = await prisma.order.create({
    data: {
      ...orderData,
      createdById: creator.id,
      createdByType: creatorType,
      subtotal,
      tax,
      total,
      items: {
        create: items.map((item) => {
          const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
          return {
            menuItemId: item.menuItemId,
            name: menuItem.name,
            quantity: item.quantity,
            unitPrice: menuItem.price,
            totalPrice: menuItem.price * item.quantity,
            notes: item.notes,
          };
        }),
      },
    },
    include: {
      items: true,
      table: true,
    },
  });

  return order;
};

export const updateOrderStatus = async (orderId, status, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      createdByStaff: true,
      createdByCustomer: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Validate status transition
  validateStatusTransition(order.status, status, user);

  // If cancelling, validate cancellation permissions
  if (status === "CANCELLED") {
    const canCancel = await canCancelOrder(order, user);
    if (!canCancel) {
      throw new Error("Unauthorized to cancel this order");
    }
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: true,
      table: true,
    },
  });
};

export const getOrders = async (restaurantId, filters) => {
  const { page = 1, limit = 10, status, startDate, endDate } = filters;
  const where = {
    restaurantId,
    ...(status && { status }),
    ...(startDate &&
      endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        table: true,
        createdByStaff: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        createdByCustomer: {
          select: {
            name: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
