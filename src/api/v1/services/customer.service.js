const customerService = require('../services/customer.service');
const { ValidationError } = require('zod');

async function createCustomer(req, res) {
  try {
    const customerData = req.body;
    const customer = await customerService.createCustomer(customerData);
    res.status(201).json({ message: "Customer created successfully", data: customer });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function getCustomerProfile(req, res) {
    try {
      const { customerId } = req.params;
      const customerProfile = await customerService.getCustomerProfile(customerId);
      if (!customerProfile) {
        return res.status(404).json({ error: "Customer profile not found" });
      }
      res.status(200).json({ data: customerProfile });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
async function updateCustomerProfile(req, res) {
    try {
      const { customerId } = req.params;
      const profileData = req.body;
      const updatedProfile = await customerService.updateCustomerProfile(customerId, profileData);
      if (!updatedProfile) {
        return res.status(404).json({ error: "Customer profile not found" });
      }
      res.status(200).json({ message: "Customer profile updated successfully", data: updatedProfile });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

module.exports={
    createCustomer,
    getCustomerProfile,
    updateCustomerProfile
}