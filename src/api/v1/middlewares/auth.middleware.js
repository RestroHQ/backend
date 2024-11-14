import { prisma } from "@/utils/prisma";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize = (roles) => {
  return async (req, res, next) => {
    try {
      const staff = await prisma.staff.findFirst({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId,
          isActive: true,
          deletedAt: null,
        },
        include: {
          restaurant: {
            select: {
              ownerId: true,
              status: true,
              deletedAt: true,
            },
          },
        },
      });

      if (!staff || !roles.includes(staff.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      if (
        roles.includes("SUPERADMIN") &&
        staff.restaurant.ownerId !== req.user.id
      ) {
        return res
          .status(403)
          .json({ message: "Only restaurant owners can perform this action" });
      }

      if (staff.restaurant.status !== "ACTIVE" || staff.restaurant.deletedAt) {
        return res
          .status(403)
          .json({ message: "Restaurant is inactive or deleted" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization error" });
    }
  };
};
