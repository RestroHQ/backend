import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const seedDatabase = async () => {
  try {
    const password = await bcrypt.hash("restrohq", 10);
    let owner, admin, restaurant;

    owner = await prisma.user.findUnique({
      where: { email: "john@restrohq.live" },
    });

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john@restrohq.live",
          password,
          phone: "+1234567890",
        },
      });
    }

    admin = await prisma.user.findUnique({
      where: {
        email: "jane@restrohq.live",
      },
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: "Jane Smith",
          email: "jane@restrohq.live",
          password,
          phone: "+1234567891",
        },
      });
    }

    restaurant = await prisma.restaurant.findUnique({
      where: {
        email: "info@goodfood.com",
      },
    });

    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          name: "The Good Food Place",
          address: "123 Main St, City",
          phone: "+1234567892",
          email: "info@goodfood.com",
          website: "https://goodfood.com",
          cuisineType: "International",
          openingTime: "09:00",
          closingTime: "22:00",
          openDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          capacity: 100,
          description: "A cozy restaurant serving international cuisine",
          ownerId: owner.id,
        },
      });

      await prisma.staff.createMany({
        data: [
          {
            userId: owner.id,
            restaurantId: restaurant.id,
            role: "SUPERADMIN",
          },
          {
            userId: admin.id,
            restaurantId: restaurant.id,
            role: "ADMIN",
          },
        ],
      });
    }

    console.log("Seed data created successfully");
  } catch (error) {
    console.error("Error seeding data", error);
  }
};
