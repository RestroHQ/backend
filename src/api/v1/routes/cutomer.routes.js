const prisma = require('../../../lib/prisma');

async function createCustomer(customerData) {
  return await prisma.customer.create({
    data: customerData,
  });
}

module.exports={
    createCustomer,
}