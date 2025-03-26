import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "@/lib/config";
import { generateDownloadUrl } from "./s3.service";

export const registerCustomer = async (data) => {
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingCustomer) {
    throw new Error("Customer with this email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const customer = await prisma.customer.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { customerId: customer.id },
    config.CUSTOMER_JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );

  // Remove password from response
  const { password, ...customerWithoutPassword } = customer;
  return { customer: customerWithoutPassword, token };
};

export const loginCustomer = async (email, password) => {
  const customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (!customer || !customer.isActive) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, customer.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { customerId: customer.id },
    config.CUSTOMER_JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );

  const { password: _, ...customerWithoutPassword } = customer;
  return { customer: customerWithoutPassword, token };
};

export const getCustomers = async (restaurantId, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const offset = (page - 1) * limit;

  const where = {
    restaurantId,
    deletedAt: null,
  };

  const total = await prisma.customer.count({ where });

  const customers = await prisma.customer.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      image: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: offset,
    take: limit,
  });

  // Generate presigned URLs for customer images
  for (const customer of customers) {
    if (customer.image) {
      customer.image = await generateDownloadUrl(customer.image, 604800);
    }
  }

  return {
    customers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCustomerById = async ({ restaurantId, customerId }) => {
  const customer = await prisma.customer.findUnique({
    where: { AND: [{ id: customerId }, { restaurantId }] },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      image: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      orders: true,
      reservations: true,
      reviews: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (customer.image) {
    customer.image = await generateDownloadUrl(customer.image, 604800);
  }

  return customer;
};

export const updateCustomer = async (id, data) => {
  const customer = await prisma.customer.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      phone: true,
      image: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (customer.image) {
    customer.image = await generateDownloadUrl(customer.image, 604800);
  }

  return customer;
};

export const deleteCustomer = async (id) => {
  await prisma.customer.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return { message: "Customer deleted successfully" };
};
