import { prisma } from "@/lib/prisma";
import { generateDownloadUrl } from "./s3.service";
import { config } from "@/lib/config";

const { EXPIRY_IN_SECONDS } = config;

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

export const getRestaurantById = async (id, userId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      staff: {
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (userId) {
    const isOwner = restaurant.ownerId === userId;
    const isManager = restaurant.staff.some(
      (staff) => staff.userId === userId && staff.role === "MANAGER"
    );

    if (!isOwner && !isManager) {
      restaurant.staff = restaurant.staff.filter(
        (staff) => staff.userId === userId
      );
    }
  }

  if (restaurant.logo) {
    restaurant.logo = await generateDownloadUrl(
      restaurant.logo,
      EXPIRY_IN_SECONDS
    );
  }

  if (restaurant.coverImage) {
    restaurant.coverImage = await generateDownloadUrl(
      restaurant.coverImage,
      EXPIRY_IN_SECONDS
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

    restaurants.forEach(async (restaurant) => {
      if (restaurant.logo) {
        restaurant.logo = await generateDownloadUrl(
          restaurant.logo,
          EXPIRY_IN_SECONDS
        );
      }

      if (restaurant.coverImage) {
        restaurant.coverImage = await generateDownloadUrl(
          restaurant.coverImage,
          EXPIRY_IN_SECONDS
        );
      }
    });

    return {
      restaurants,
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

export const getUserRestaurants = async (
  user,
  { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = {}
) => {
  try {
    const offset = (page - 1) * limit;

    const total = await prisma.restaurant.count({
      where: {
        ownerId: user.id,
        deletedAt: null,
      },
    });

    const restaurants = await prisma.restaurant.findMany({
      where: {
        ownerId: user.id,
        deletedAt: null,
      },
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
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limit,
    });

    restaurants.forEach(async (restaurant) => {
      if (restaurant.logo) {
        restaurant.logo = await generateDownloadUrl(
          restaurant.logo,
          EXPIRY_IN_SECONDS
        );
      }

      if (restaurant.coverImage) {
        restaurant.coverImage = await generateDownloadUrl(
          restaurant.coverImage,
          EXPIRY_IN_SECONDS
        );
      }
    });

    return {
      restaurants,
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
