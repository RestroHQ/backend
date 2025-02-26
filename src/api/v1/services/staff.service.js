import { prisma } from "@/lib/prisma";

export const addRestaurantStaff = async (restaurantId, data, userId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      staff: true,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const isOwner = restaurant.ownerId === userId;
  const isAdmin = restaurant.staff.some(
    (staff) => staff.userId === userId && staff.user.role === "ADMIN"
  );

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized to add staff");
  }

  const existingStaff = restaurant.staff.find(
    (staff) => staff.userId === data.userId
  );

  if (existingStaff) {
    throw new Error("User is already a staff member");
  }

  const staffMember = await prisma.restaurantStaff.create({
    data: {
      restaurantId,
      userId: data.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return staffMember;
};

export const removeRestaurantStaff = async (
  restaurantId,
  staffUserId,
  requestingUserId
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      staff: true,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const isOwner = restaurant.ownerId === requestingUserId;
  const isAdmin = restaurant.staff.some(
    (staff) => staff.userId === requestingUserId && staff.user.role === "ADMIN"
  );

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized to remove staff");
  }

  await prisma.restaurantStaff.deleteMany({
    where: {
      restaurantId,
      userId: staffUserId,
    },
  });

  return { message: "Staff member removed successfully" };
};

export const getRestaurantStaff = async (
  restaurantId,
  userId,
  { page = 1, limit = 10, sortBy = "joinedAt", sortOrder = "desc" } = {}
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      staff: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const isOwner = restaurant.ownerId === userId;
  const isAdmin = restaurant.staff.some(
    (staff) => staff.userId === userId && staff.user.role === "ADMIN"
  );

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized to view staff");
  }

  const offset = (page - 1) * limit;

  const [staff, total] = await Promise.all([
    prisma.restaurantStaff.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limit,
    }),
    prisma.restaurantStaff.count({ where: { restaurantId } }),
  ]);

  return {
    staff,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
