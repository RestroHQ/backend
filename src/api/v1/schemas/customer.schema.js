const { z } = require('zod');

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must have at least 10 digits").optional(),
  address: z.string().min(1, "Address is required"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

module.exports = customerSchema;
