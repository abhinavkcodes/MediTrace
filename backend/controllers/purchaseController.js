const db = require('../config/database');

const getMedicineStores = async (req, res) => {
  const { name } = req.params;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Medicine name is required' });
  }

  try {
    const searchTerm = `%${name.trim()}%`;
    const medicine = await db.get(
      'SELECT id, brandName, genericName, price, category, manufacturer FROM medicines WHERE brandName LIKE ? OR genericName LIKE ? LIMIT 1',
      [searchTerm, searchTerm]
    );

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    const stores = await db.all(
      `SELECT s.id, s.name, s.address, s.city, s.state, s.zipCode, s.latitude, s.longitude, i.quantity
       FROM stores s
       JOIN inventory i ON i.store_id = s.id
       WHERE i.medicine_id = ? AND i.quantity > 0
       ORDER BY i.quantity DESC, s.name ASC`,
      [medicine.id]
    );

    return res.status(200).json({
      success: true,
      medicine: {
        id: medicine.id,
        name: medicine.brandName || medicine.genericName,
        genericName: medicine.genericName,
        brandName: medicine.brandName,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        price: parseFloat(medicine.price || 0).toFixed(2)
      },
      stores
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

const getMedicineStoresById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Medicine ID is required' });
  }

  try {
    const medicine = await db.get(
      'SELECT id, brandName, genericName, price, category, manufacturer FROM medicines WHERE id = ? LIMIT 1',
      [id]
    );

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    const stores = await db.all(
      `SELECT s.id, s.name, s.address, s.city, s.state, s.zipCode, s.latitude, s.longitude, i.quantity
       FROM stores s
       JOIN inventory i ON i.store_id = s.id
       WHERE i.medicine_id = ? AND i.quantity > 0
       ORDER BY i.quantity DESC, s.name ASC`,
      [medicine.id]
    );

    return res.status(200).json({
      success: true,
      medicine: {
        id: medicine.id,
        name: medicine.brandName || medicine.genericName,
        genericName: medicine.genericName,
        brandName: medicine.brandName,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        price: parseFloat(medicine.price || 0).toFixed(2)
      },
      stores
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

const placeOrder = async (req, res) => {
  const { user_id, medicine_id, store_id, quantity } = req.body;

  if (!user_id || !medicine_id || !store_id || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'user_id, medicine_id, store_id and positive quantity are required'
    });
  }

  try {
    const inventory = await db.get(
      'SELECT quantity FROM inventory WHERE store_id = ? AND medicine_id = ?',
      [store_id, medicine_id]
    );

    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Out of stock or insufficient quantity' });
    }

    const medicine = await db.get('SELECT id, brandName, genericName, price FROM medicines WHERE id = ? LIMIT 1', [medicine_id]);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    const unitPrice = parseFloat(medicine.price || 0);
    const totalAmount = parseFloat((unitPrice * quantity).toFixed(2));

    await db.run('BEGIN TRANSACTION');

    const orderResult = await db.run(
      'INSERT INTO orders (user_id, store_id, total_amount, status) VALUES (?, ?, ?, ?)',
      [user_id, store_id, totalAmount, 'placed']
    );

    const orderId = orderResult.lastID;
    await db.run(
      'INSERT INTO order_items (order_id, medicine_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderId, medicine_id, quantity, unitPrice]
    );

    await db.run(
      'UPDATE inventory SET quantity = quantity - ? WHERE store_id = ? AND medicine_id = ?',
      [quantity, store_id, medicine_id]
    );

    await db.run('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        order_id: orderId,
        user_id,
        medicine_id,
        store_id,
        quantity,
        unit_price: unitPrice.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        status: 'placed'
      }
    });
  } catch (error) {
    try {
      await db.run('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    return res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const orders = await db.all(
      `SELECT o.id AS order_id, o.user_id, o.store_id, o.total_amount, o.status, o.createdAt AS created_at,
              s.name AS store_name
       FROM orders o
       JOIN stores s ON s.id = o.store_id
       WHERE o.user_id = ?
       ORDER BY o.createdAt DESC`,
      [userId]
    );

    const formattedOrders = await Promise.all(orders.map(async (order) => {
      const items = await db.all(
        `SELECT oi.medicine_id, oi.quantity, oi.unit_price, m.brandName AS medicine_name
         FROM order_items oi
         JOIN medicines m ON m.id = oi.medicine_id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );

      return {
        ...order,
        items
      };
    }));

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
};

module.exports = {
  getMedicineStores,
  getMedicineStoresById,
  placeOrder,
  getUserOrders
};