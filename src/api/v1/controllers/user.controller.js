import { errorHandler } from "@/lib/error-handler";
import * as userService from "../services/user.service";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.json(users);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.json(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { user } = req;
    res.json(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const { user } = req;

    const updatedUser = await userService.updateUserRole(id, role, user);

    res.json(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const data = req.body;

    if (id !== user.id) {
      throw new Error("You can only update your own account");
    }

    const updatedUser = await userService.updateUser(id, data, user);

    res.json(updatedUser);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    await userService.deleteUser(id, user);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.restoreUser(id);

    res.json({ message: "User restored successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};
