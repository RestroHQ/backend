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

async function updateCustomerProfile(customerId, profileData) {
    return await prisma.profile.update({
      where: { customerId },
      data: profileData,
    });
  }

module.exports={
    createCustomer,
    getCustomerProfile,
    updateCustomerProfile
}