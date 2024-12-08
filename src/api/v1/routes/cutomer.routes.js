const prisma = require('../../../lib/prisma');

async function createCustomer(customerData) {
  return await prisma.customer.create({
    data: customerData,
  });
}

async function getCustomerProfile(customerId) {
    return await prisma.customer.findUnique({
      where: { id: customerId },
      include: { profile: true }, // Includes the profile details
    });
  }

module.exports={
    createCustomer,
    getCustomerProfile
}