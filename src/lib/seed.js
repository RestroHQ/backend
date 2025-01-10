import { prisma } from "./prisma";

export const seedDB = async () => {
  const superadminData = {
    name: "Admin",
    username: "admin",
    email: "admin@restrohq.live",
    password: "Asd*1234",
    role: "ADMIN",
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email: superadminData.email },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          name: superadminData.name,
          username: superadminData.username,
          email: superadminData.email,
          password: superadminData.password,
          role: superadminData.role,
        },
      });

      /* eslint-disable no-console */
      console.log("Superadmin account created successfully!");
      console.log(`Email: ${superadminData.email}`);
      console.log(`Password: ${superadminData.password}`);
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
