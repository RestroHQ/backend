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

module.exports={
    createCustomer
}