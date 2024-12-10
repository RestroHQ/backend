import { prisma } from '../prisma/prisma';


export const getAllTables = async (restaurantId) => {
  try {
    return await prisma.table.findMany({
      where: { restaurantId },
    });
  } catch (error) {
    throw new Error("Error fetching tables: " + error.message);
  }
};


export const createTable = async (restaurantId, data) => {
  try {
    // Validation (if needed)
    if (!data.name || !data.capacity) {
      throw new Error("Table name and capacity are required.");
    }

   
    const existingTable = await prisma.table.findFirst({
      where: {
        restaurantId,
        name: data.name,
      },
    });

    if (existingTable) {
      throw new Error("Table with this name already exists.");
    }

   
    return await prisma.table.create({
      data: {
        ...data,
        restaurantId,
      },
    });
  } catch (error) {
    throw new Error("Error creating table: " + error.message);
  }
};


export const updateTable = async (tableId, data) => {
  try {
    // Validate that data has the necessary fields
    if (!data.name && !data.capacity) {
      throw new Error("You must provide either a name or a capacity to update.");
    }

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data,
    });

    return updatedTable;
  } catch (error) {
    throw new Error("Error updating table: " + error.message);
  }
};


export const deleteTable = async (tableId) => {
  try {
    // Check if the table exists
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new Error("Table not found.");
    }
 // Proceed to delete the table
    return await prisma.table.delete({
      where: { id: tableId },
    });
  } catch (error) {
    throw new Error("Error deleting table: " + error.message);
  }
};
