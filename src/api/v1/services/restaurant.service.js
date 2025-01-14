import { prisma } from "@/lib/prisma";
import { generateDownloadUrl } from "./s3.service";

export const createRestaurant = async (data, ownerId) => {
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { OR: [{ email: data.email }, { slug: data.slug }] },
  });

  if (existingRestaurant) {
    throw new Error("Restaurant with this email already exists");
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...data,
      ownerId: ownerId,
    },
  });

  try {
    await prisma.restaurantStaff.create({
      data: {
        restaurantId: restaurant.id,
        userId: ownerId,
        role: "OWNER",
      },
    });
  } catch (error) {
    await prisma.restaurant.delete({
      where: { id: restaurant.id },
    });
    throw new Error("Failed to create restaurant");
  }

  return restaurant;
};

export const updateRestaurant = async (id, data, userId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.ownerId !== userId) {
    throw new Error("Unauthorized to update this restaurant");
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return updatedRestaurant;
};

export const deleteRestaurant = async (id, userId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.ownerId !== userId) {
    throw new Error("Unauthorized to delete this restaurant");
  }

  await prisma.restaurant.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: "INACTIVE",
    },
  });

  return { message: "Restaurant deleted successfully" };
};

export const getRestaurantById = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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

  if (restaurant.logo) {
    restaurant.logo = await generateDownloadUrl(restaurant.logo, 604800);
  }

  if (restaurant.coverImage) {
    restaurant.coverImage = await generateDownloadUrl(
      restaurant.coverImage,
      604800
    );
  }

  return restaurant;
};

export const getRestaurants = async (
  user,
  { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  try {
    const offset = (page - 1) * limit;

    let where = {
      deletedAt: null,
    };

    if (user.role !== "ADMIN") {
      where = {
        ...where,
        OR: [
          { ownerId: user.id },
          {
            staff: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      };
    }

    const total = await prisma.restaurant.count({ where });

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limit,
    });

    const restaurantsWithUrls = [];

    restaurants.forEach(async (restaurant) => {
      const restaurantCopy = { ...restaurant };

      if (restaurant.logo) {
        restaurantCopy.logo = await generateDownloadUrl(
          restaurant.logo,
          604800
        );
      }

      if (restaurant.coverImage) {
        restaurantCopy.coverImage = await generateDownloadUrl(
          restaurant.coverImage,
          604800
        );
      }

      restaurantsWithUrls.push(restaurantCopy);
    });

    return {
      restaurants: restaurantsWithUrls,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch restaurants: ${error.message}`);
  }
};

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
