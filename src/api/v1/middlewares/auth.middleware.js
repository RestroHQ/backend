import { config } from "@/lib/config";
import { errorHandler } from "@/lib/error-handler";
import { prisma } from "@/utils/prisma";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    req.user = user;

    next();
  } catch (error) {
    errorHandler(401, "Invalid token", res);
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorHandler(403, "Insufficient permissions", res);
    }
    next();
  };
};
