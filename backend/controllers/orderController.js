// backend/controllers/orderController.js
const db = require('../config/database');

const getAllOrders = async (req, res) => {
  try {
    const orders = await db.all(
      `SELECT
        o.id,
        o.user_id,
        u.name AS user_name,
        o.store_id,
        s.name AS store_name,
        o.total_amount,
        o.status,
        o.createdAt AS created_at
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN stores s ON s.id = o.store_id
      ORDER BY o.createdAt DESC`
    );

    const formattedOrders = await Promise.all(orders.map(async (order) => {
      const items = await db.all(
        `SELECT oi.medicine_id, oi.quantity, oi.unit_price, m.brandName AS medicine_name
         FROM order_items oi
         JOIN medicines m ON oi.medicine_id = m.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      return {
        ...order,
        items
      };
    }));

    return res.status(200).json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

module.exports = {
  getAllOrders
};