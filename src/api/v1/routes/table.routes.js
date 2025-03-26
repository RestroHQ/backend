import express from "express";
import {
  authenticate,
  authorize,
  authorizeRestaurantRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTableSchema, updateTableSchema } from "../schemas/table.schema";
import * as tableController from "../controllers/table.controller";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(createTableSchema),
  tableController.createTable
);

router.patch(
  "/:tableId",
  authenticate,
  authorize(["USER"]),
  authorizeRestaurantRole(["OWNER", "MANAGER"]),
  validate(updateTableSchema),
  tableController.updateTable
);

router.get("/available", tableController.getAvailableTables);

export const tableRouter = router;
