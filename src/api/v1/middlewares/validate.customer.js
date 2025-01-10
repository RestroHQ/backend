const { z } = require('zod');

const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const updateProfileSchema = z.object({
  bio: z.string().max(500, 'Bio should not exceed 500 characters').optional(),
  preferences: z.string().max(255, 'Preferences should not exceed 255 characters').optional(),
});

const addLoyaltyPointsSchema = z.object({
  points: z.number().int().min(1, 'Points must be a positive integer'),
});

function validateCreateCustomer(data) {
  try {
    createCustomerSchema.parse(data);
    return null; 
  } catch (e) {
    return e.errors;
  }
}

function validateUpdateProfile(data) {
  try {
    updateProfileSchema.parse(data);
    return null;
  } catch (e) {
    return e.errors;
  }
}

function validateAddLoyaltyPoints(data) {
  try {
    addLoyaltyPointsSchema.parse(data);
    return null; 
  } catch (e) {
    return e.errors;
  }
}

module.exports = {
  validateCreateCustomer,
  validateUpdateProfile,
  validateAddLoyaltyPoints,
};
