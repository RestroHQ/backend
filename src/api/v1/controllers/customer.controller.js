const prisma = require('../../../../utils/prisma');

exports.getAllCustomers = async (req, res) => {
    try {
      const customers = await prisma.customer.findMany();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  };

  exports.getCustomerById = async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  };

  