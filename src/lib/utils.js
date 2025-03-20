export const calcUptime = () => {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor(((uptime % 86400) % 3600) / 60);
  const seconds = Math.floor(((uptime % 86400) % 3600) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const calculateOrderTotals = (items, menuItems, taxRate = 0.1) => {  
  const subtotal = items.reduce((acc, item) => {
    const menuItem = menuItems.find((menu) => menu.menuItemId === item.id);
    return acc + menuItem.price * item.quantity;
  }, 0);

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}