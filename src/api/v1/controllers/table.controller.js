import { errorHandler } from '@/lib/error-handler';
import * as tableService from '../services/table.service';


export const getTables = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const tables = await tableService.getAllTables(restaurantId);

    if (!tables || tables.length === 0) {
      return res.status(404).json({ error: 'No tables found for this restaurant' });
    }

    res.status(200).json(tables);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createTable = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, capacity } = req.body;

  
    if (!name || !capacity) {
      return res.status(400).json({ error: 'Table name and capacity are required' });
    }

    const table = await tableService.createTable(restaurantId, req.body);
    res.status(201).json(table);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    if (!name && !capacity) {
      return res.status(400).json({ error: 'You must provide either a name or capacity to update' });
    }

    const updatedTable = await tableService.updateTable(id, req.body);
    res.status(200).json(updatedTable);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await tableService.deleteTable(id);

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.status(204).send();
  } catch (error) {
    errorHandler(error, res);
  }
};
