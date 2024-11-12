import * as authService from "@/api/v1/services/auth.service";

export const registerUser = async (req, res) => {
  try {
    const user = await authService.register(req.validatedData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.validatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { password, ...user } = req.user;
  res.status(200).json(user);
};
