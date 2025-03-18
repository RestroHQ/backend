import { config } from "@/lib/config";
import { errorHandler } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const authenticateCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return errorHandler("Authentication required", res, 401);
    }
    
    const decoded = jwt.verify(token, config.CUSTOMER_JWT_SECRET);
    
    console.log(decoded);

    if (!decoded.customerId) {
      return errorHandler("Invalid token type", res, 401);
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: decoded.customerId,
        isActive: true,
        deletedAt: null,
      },
    });

    console.log(customer);

    if (!customer) {
      return errorHandler("Customer not found or inactive", res, 401);
    }

    req.customer = customer;
    next();
  } catch (error) {
    errorHandler(error, res, 401);
  }
};

export const authorizeCustomerOwnership = async (req, res, next) => {
  try {
    const { customer } = req;
    const resourceId = req.params.id;

    if (customer.id === resourceId) {
      return next();
    }

    return errorHandler("Unauthorized access to resource", res, 403);
  } catch (error) {
    errorHandler(error, res, 403);
  }
};

export const verifyCustomerRestaurant = async (req, res, next) => {
  try {
    const { customer } = req;
    const restaurantId =
      req.params.restaurantId ||
      req.body.restaurantId ||
      req.query.restaurantId;

    if (!restaurantId) {
      return errorHandler("Restaurant ID is required", res, 400);
    }

    const customerRestaurant = await prisma.customer.findFirst({
      where: {
        id: customer.id,
        restaurantId: restaurantId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!customerRestaurant) {
      return errorHandler(
        "Customer does not belong to this restaurant",
        res,
        403
      );
    }

    next();
  } catch (error) {
    errorHandler(error, res, 403);
  }
};
