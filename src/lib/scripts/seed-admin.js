import { config } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const { ADMIN_EMAIL, ADMIN_PASSWORD } = config;
const adminData = {
  name: "Admin",
  username: "admin",
  email: ADMIN_EMAIL || "admin@restrohq.live",
  password: ADMIN_PASSWORD || "Asd*1234",
  role: "ADMIN",
};

export const seedAdmin = async () => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    const salt = await bcrypt.genSalt(parseInt(config.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    if (!user) {
      await prisma.user.create({
        data: {
          name: adminData.name,
          username: adminData.username,
          email: adminData.email,
          password: hashedPassword,
          role: adminData.role,
        },
      });

      /* eslint-disable no-console */
      console.log("Admin account created successfully!");
      console.log(`Email: ${adminData.email}`);
      console.log(`Password: ${adminData.password}`);
      console.log(
        "IMPORTANT: Please change the password immediately after the first login for security purposes."
      );
      /* eslint-enable no-console */
    }
  } catch (error) {
    console.error("Error creating admin user:");
    console.error(error);
  }
};
