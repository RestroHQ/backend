import { errorHandler } from "@/lib/error-handler";
import * as analyticsService from "../services/analytics.service";

export const getRestaurantAnalytics = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;

    const [userAnalytics, orderAnalytics, staffAnalytics, customerBehavior] =
      await Promise.all([
        analyticsService.getUserAnalytics(restaurantId),
        analyticsService.getOrderAnalytics(restaurantId, startDate, endDate),
        analyticsService.getStaffAnalytics(restaurantId),
        analyticsService.getCustomerBehaviorAnalytics(restaurantId),
      ]);

    res.json({
      ...userAnalytics,
      ...orderAnalytics,
      ...staffAnalytics,
      ...customerBehavior,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
