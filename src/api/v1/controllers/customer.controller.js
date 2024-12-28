const prisma = require("../../../../utils/prisma");

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customer = await prisma.customer.create({
      data: { name, email, phone, address },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to create customer" });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, loyaltyPoints } = req.body;
    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(id) },
      data: { name, email, phone, address, loyaltyPoints },
    });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await prisma.order.findMany({
      where: { customerId: Number(id) },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order history" });
  }
};

exports.getCustomerAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const totalOrders = await prisma.order.count({
      where: { customerId: Number(id) },
    });
    const totalSpent = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { customerId: Number(id) },
    });

    const analytics = {
      totalOrders,
      totalSpent: totalSpent._sum.totalAmount || 0,
      averageSpend: totalOrders ? totalSpent._sum.totalAmount / totalOrders : 0,
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
