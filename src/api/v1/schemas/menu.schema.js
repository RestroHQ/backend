import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  menuItems: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        description: z.string().optional(),
        price: z.number().positive("Price must be positive"),
        imageUrl: z.string().optional(),
        isAvailable: z.boolean().optional().default(true),
      })
    )
    .optional(),
});

export const updateMenuSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
});

export const updateMenuItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional(),
});
