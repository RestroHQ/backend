import { errorHandler } from "@/lib/error-handler";
import * as authService from "../services/auth.service";

export const register = async (req, res) => {
  try {
    const { validatedData } = req;
    const user = await authService.register(validatedData);

    res.status(201).json(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { validatedData } = req;
    const user = await authService.login(validatedData);

    res.json(user);
  } catch (error) {
    errorHandler(error, res);
  }
};
