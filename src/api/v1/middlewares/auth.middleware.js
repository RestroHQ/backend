import { config } from "@/lib/config";
import { errorHandler } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/user.service";

export const authenticateStaff = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorHandler("Authentication required", res, 401);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await getUserById(decoded.userId);

    if (!user) {
      return errorHandler("User not found or inactive", res, 401);
    }

    req.user = user;

    next();
  } catch (error) {
    errorHandler(error, res, 401);
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorHandler("Insufficient permissions", res, 403);
    }
    next();
  };
};

export const authorizeRestaurantRole = (roles) => {
  return async (req, res, next) => {
    try {
      const { user } = req;
      const restaurantId =
        req.params.restaurantId ||
        req.body.restaurantId ||
        req.query.restaurantId;

      if (!restaurantId) {
        return errorHandler("Restaurant ID is required", res, 400);
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
          ownerId: user.id,
        },
      });

      if (restaurant) {
        return next();
      }

      const staffMember = await prisma.restaurantStaff.findUnique({
        where: {
          restaurantId_userId: {
            restaurantId,
            userId: user.id,
          },
        },
      });

      if (!staffMember || !roles.includes(staffMember.role)) {
        return errorHandler("Insufficient permissions", res, 403);
      }

      next();
    } catch (error) {
      errorHandler(error, res, 403);
    }
  };
};
