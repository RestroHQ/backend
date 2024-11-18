import { prisma } from "@/lib/prisma";
import { restore, softDelete } from "./base.service";
import { saveFile } from "@/lib/files";

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

  return users;
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
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

  if (!user) {
    throw new Error("User not found");
  }

  return user;
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

  let imagePath = user.image;

  if (data.image) {
    imagePath = await saveFile("users", user.id, data.image);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      image: imagePath,
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
