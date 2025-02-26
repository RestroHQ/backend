import { errorHandler } from "@/lib/error-handler";
import * as usageService from "../services/usage.service";

export const getUsage = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const usage = await usageService.getUsage(restaurantId);

    res.json(usage);
  } catch (error) {
    errorHandler(error, res);
  }
};
