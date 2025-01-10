import { config } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (data) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error(
      existingUser.email === data.email
        ? "Email already registered"
        : "Username already taken"
    );
  }

  const userId = createId();

  const salt = await bcrypt.genSalt(parseInt(config.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = await prisma.user.create({
    data: {
      ...data,
      id: userId,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
      isActive: true,
      deletedAt: null,
    },
    include: {
      staffAt: {
        select: {
          id: true,
          restaurantId: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const updatePassword = async (
  userId,
  { currentPassword, newPassword }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
