import { prisma } from "@/lib/prisma";
import { saveFile } from "@/lib/files";
import { createId } from "@paralleldrive/cuid2";

export const createRestaurant = async (data, ownerId) => {
  const existingRestaurant = await prisma.restaurant.findUnique({
    where: { email: data.email },
  });

  if (existingRestaurant) {
    throw new Error("Restaurant with this email already exists");
  }

  const restaurantId = createId();

  let logoPath = null;
  let coverImagePath = null;

  if (data.logo) {
    logoPath = await saveFile("restaurants", restaurantId, "logo", data.logo);
  }

  if (data.coverImage) {
    coverImagePath = await saveFile(
      "restaurants",
      restaurantId,
      "cover",
      data.coverImage,
    );
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...data,
      id: restaurantId,
      logo: logoPath,
      coverImage: coverImagePath,
      ownerId: ownerId,
    },
  });

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

  let logoPath = restaurant.logo;
  let coverImagePath = restaurant.coverImage;

  if (data.logo) {
    logoPath = await saveFile("restaurants", id, "logo", data.logo);
  }

  if (data.coverImage) {
    coverImagePath = await saveFile(
      "restaurants",
      id,
      "cover",
      data.coverImage,
    );
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      ...data,
      logo: logoPath,
      coverImage: coverImagePath,
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

  return restaurant;
};

export const getUserRestaurants = async (userId) => {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          staff: {
            some: {
              userId: userId,
            },
          },
        },
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

  return restaurants;
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
    (staff) => staff.userId === userId && staff.user.role === "ADMIN",
  );

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized to add staff");
  }

  const existingStaff = restaurant.staff.find(
    (staff) => staff.userId === data.userId,
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
  requestingUserId,
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
    (staff) => staff.userId === requestingUserId && staff.user.role === "ADMIN",
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

export const getRestaurantStaff = async (restaurantId, userId) => {
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
    (staff) => staff.userId === userId && staff.user.role === "ADMIN",
  );

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized to view staff");
  }

  return restaurant.staff;
};
