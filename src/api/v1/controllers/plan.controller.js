import { errorHandler } from "@/lib/error-handler";
import * as planService from "../services/plan.service";

export const getPlans = async (req, res) => {
  try {
    const plans = await planService.getPlans();

    res.json(plans);
  } catch (error) {
    errorHandler(error, res);
  }
};
