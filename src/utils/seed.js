// prisma/seed.js
import bcrypt from "bcryptjs";
import { config } from "./config";
import { prisma } from "./prisma";

export const createSuperAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: config.SUPER_ADMIN_EMAIL || "superadmin@restrohq.tech",
      },
    });

    if (existingAdmin) {
      console.log("Super admin already exists, skipping creation.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.SUPER_ADMIN_PASSWORD || "supersecret",
      10,
    );

    const superAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        username: "superadmin",
        email: config.SUPER_ADMIN_EMAIL || "superadmin@restrohq.tech",
        password: hashedPassword,
        role: "SUPERADMIN",
      },
    });

    console.log("Super admin created successfully:", {
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role,
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
