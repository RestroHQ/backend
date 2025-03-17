import { prisma } from "@/lib/prisma";

const calculateOrderTotals = async (items) => {
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((item) => item.menuItemId) } },
  });

  const subtotal = items.reduce((sum, item) => {
    const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
    return sum + menuItem.price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

export const createPosOrder = async (restaurantId, staffId, data) => {
  const { items, ...orderData } = data;
  const { subtotal, tax, total } = await calculateOrderTotals(items);

  return await prisma.order.create({
    data: {
      ...orderData,
      restaurantId,
      createdById: staffId,
      createdByType: "STAFF",
      orderChannel: "POS",
      subtotal,
      tax,
      total,
      status: "PENDING",
      items: {
        create: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes,
        })),
      },
    },
    include: {
      items: true,
      customer: true,
      table: true,
    },
  });
};

export const processPayment = async (orderId, data) => {
  const { payments } = data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const changeAmount = Math.max(0, totalPaid - order.total);

  return await prisma.$transaction(async (tx) => {
    await Promise.all(
      payments.map((payment) =>
        tx.orderPayment.create({
          data: {
            orderId,
            amount: payment.amount,
            paymentType: payment.paymentType,
            paymentMethod:
              payment.paymentType === "CASH" ? "CASH" : "CREDIT_CARD",
            status: "PAID",
            cardLast4: payment.cardLast4,
            cardType: payment.cardType,
            transactionId: payment.transactionId,
          },
        })
      )
    );

    return tx.order.update({
      where: { id: orderId },
      data: {
        amountPaid: totalPaid,
        changeAmount,
        status: "COMPLETED",
      },
      include: {
        payments: true,
        items: true,
      },
    });
  });
};

export const voidOrder = async (orderId, staffId, data) => {
  const { reason, notes } = data;

  return await prisma.order.update({
    where: { id: orderId },
    data: {
      isVoided: true,
      voidReason: reason,
      voidedAt: new Date(),
      voidedBy: staffId,
      notes: notes ? `${notes}\nVoided: ${reason}` : `Voided: ${reason}`,
      status: "CANCELLED",
    },
    include: {
      items: true,
      payments: true,
    },
  });
};

export const refundPayment = async (paymentId, staffId, data) => {
  const { amount, reason, notes } = data;

  const payment = await prisma.orderPayment.findUnique({
    where: { id: paymentId },
  });

  if (!payment || payment.status !== "PAID") {
    throw new Error("Invalid payment or already refunded");
  }

  if (amount > payment.amount) {
    throw new Error("Refund amount cannot exceed payment amount");
  }

  return await prisma.orderPayment.update({
    where: { id: paymentId },
    data: {
      refundedAmount: amount,
      refundReason: reason,
      refundedAt: new Date(),
      refundedBy: staffId,
      status: amount === payment.amount ? "REFUNDED" : "PARTIALLY_REFUNDED",
      notes,
    },
  });
};
