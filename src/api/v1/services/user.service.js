import { restore, softDelete } from "./base.service";

export const getAllUsers = () => {
  const users = prisma.user.findMany({
    where: { isActive: true, deletedAt: null },
  });

  return users.forEach((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const getUserById = (id) => {
  const user = prisma.user.findUnique({
    where: { id, isActive: true, deletedAt: null },
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const updateUser = (id, data) => {
  const user = prisma.user.update({
    where: { id },
    data,
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const deleteUser = (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const softDeleteUser = (id) => {
  return softDelete("user", id);
};

export const restoreUser = (id) => {
  return restore("user", id);
};
