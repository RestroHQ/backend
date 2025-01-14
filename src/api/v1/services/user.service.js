import { prisma } from "@/lib/prisma";
import { restore, softDelete } from "./base.service";
import { generateDownloadUrl } from "./s3.service";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  users.forEach(async (user) => {
    if (user.image) {
      user.image = await generateDownloadUrl(user.image, 604800);
    }
  });

  return users;
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
      isActive: true,
      deletedAt: null,
    },
    include: {
      staffAt: {
        select: {
          id: true,
          restaurantId: true,
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.image) {
    user.image = await generateDownloadUrl(user.image);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserRole = async (id, role, adminUser) => {
  if (adminUser.role !== "SUPERADMIN") {
    throw new Error("Only super admins can update user roles");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (updatedUser.image) {
    updatedUser.image = await generateDownloadUrl(updatedUser.image, 604800);
  }

  return updatedUser;
};

export const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (id !== user.id) {
    throw new Error("You can't update another user's profile");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (updatedUser.image) {
    updatedUser.image = await generateDownloadUrl(updatedUser.image, 604800);
  }

  return updatedUser;
};

export const deleteUser = async (id, user) => {
  if (user.id !== id) {
    throw new Error("You can't delete another user's profile");
  }

  const deletedUser = await softDelete("user", id);

  return deletedUser;
};

export const restoreUser = async (id, adminUser) => {
  if (adminUser.role !== "SUPERADMIN" || adminUser.role !== "ADMIN") {
    throw new Error("Only super admins and admins can restore users");
  }

  const restoredUser = await restore("user", id);

  return restoredUser;
};
