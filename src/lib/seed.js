import { register } from "@/api/v1/services/auth.service";

export const seedDB = async () => {
  const superadminData = {
    name: "Super Admin",
    username: "superadmin",
    email: "superadmin@restrohq.live",
    password: "Asd*1234",
    role: "SUPERADMIN",
  };

  try {
    await register(superadminData);
    console.log("Superadmin user created successfully");
  } catch (error) {
    console.error("Error creating superadmin user");
  }
};
