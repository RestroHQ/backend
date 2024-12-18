import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTableSchema, updateTableSchema } from "../schemas/table.schema";
import * as tableController from "../controllers/table.controller";

const router = express.Router();

router.get(
  "/:restaurantId",
  authenticate,
  tableController.getTables
);

router.post(
  "/:restaurantId",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  validate(createTableSchema),
  tableController.createTable
);

router.put(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  validate(updateTableSchema),
  tableController.updateTable
);

router.delete(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN", "ADMIN"]),
  tableController.deleteTable
);

export const tableRouter = router;