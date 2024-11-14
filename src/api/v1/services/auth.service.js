import { config } from "@/utils/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email, isActive: true, deletedAt: null },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
