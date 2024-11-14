import { PrismaClient } from "@prisma/client";
import { config } from "@/utils/config";

const prisma = new PrismaClient();

export const createRestaurant = async (data, userId) => {
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
  });

  if (existingRestaurant) {
    throw new Error("Restaurant with this email already exists");
  }

  const restaurant = await prisma.$transaction(async (prisma) => {
    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });

    await prisma.staff.create({
      data: {
        userId,
        restaurantId: newRestaurant.id,
        role: "SUPERADMIN",
      },
    });

    return newRestaurant;
  });

  return restaurant;
};

export const updateRestaurant = async (id, data, userId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      staff: {
        where: {
          userId,
          role: "SUPERADMIN",
          isActive: true,
          deletedAt: null,
        },
      },
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.staff.length === 0) {
    throw new Error("Unauthorized to update restaurant");
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data,
  });

  return updatedRestaurant;
};

export const deleteRestaurant = async (id, userId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      staff: {
        where: {
          userId,
          role: "SUPERADMIN",
          isActive: true,
          deletedAt: null,
        },
      },
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (restaurant.staff.length === 0) {
    throw new Error("Unauthorized to delete restaurant");
  }

  await prisma.$transaction([
    prisma.staff.updateMany({
      where: { restaurantId: id },
      data: { deletedAt: new Date() },
    }),
    prisma.restaurant.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),
  ]);

  return { message: "Restaurant deleted successfully" };
};

export const getRestaurant = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      staff: {
        where: {
          isActive: true,
          deletedAt: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return restaurant;
};

export const listRestaurants = async (query = {}) => {
  const { page = 1, limit = 10, search = "" } = query;

  const restaurants = await prisma.restaurant.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
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
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.restaurant.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
      deletedAt: null,
    },
  });

  return {
    data: restaurants,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
