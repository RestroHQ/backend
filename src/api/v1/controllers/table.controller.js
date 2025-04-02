import { errorHandler } from "@/lib/error-handler";
import * as tableService from "../services/table.service";

export const getTables = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const tables = await tableService.getAllTables(restaurantId);

    if (!tables || tables.length === 0) {
      return res
        .status(404)
        .json({ error: "No tables found for this restaurant" });
    }

    res.status(200).json(tables);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createTable = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const table = await tableService.createTable(restaurantId, req.body);

    res.status(201).json(table);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await tableService.updateTable(tableId, req.body);

    res.json(table);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getAvailableTables = async (req, res) => {
  try {
    const { timeSlotId, guestCount } = req.query;

    const tables = await tableService.getAvailableTables(
      req.params.restaurantId,
      timeSlotId,
      parseInt(guestCount)
    );

    res.json(tables);
  } catch (error) {
    errorHandler(error, res);
  }
};
