const prisma = require('../../../../utils/prisma');

exports.getAllCustomers = async (req, res) => {
    try {
      const customers = await prisma.customer.findMany();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  };
  