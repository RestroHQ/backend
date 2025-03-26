import { prisma } from "@/lib/prisma";
import { calculateOrderTotals } from "@/lib/utils";

const validateStatusTransition = (currentStatus, newStatus, user) => {
  // Allow transitions where the current status and new status are the same
  if (currentStatus === newStatus) {
    return;
  }

  const validTransitions = {
    PENDING: ["PREPARING", "READY", "CANCELLED"],
    PREPARING: ["READY", "CANCELLED"],
    READY: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }

  // Additional validation logic (e.g., user permissions) can be added here
};

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

  console.log("creator", creator);
  console.log("creatorType", creatorType);

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
      items: true,
      table: true,
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
