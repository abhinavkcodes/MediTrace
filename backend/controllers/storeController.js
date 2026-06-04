// backend/controllers/storeController.js
const db = require('../config/database');

const getAllStores = async (req, res) => {
  try {
    const stores = await db.all(
      'SELECT id, name, address, city, state, zipCode, latitude, longitude FROM stores ORDER BY city, name ASC'
    );

    const formattedStores = await Promise.all(stores.map(async (store) => {
      const stockRow = await db.get(
        'SELECT SUM(quantity) AS total_quantity FROM inventory WHERE store_id = ?',
        [store.id]
      );

      const medicines = await db.all(
        `SELECT m.brandName
         FROM inventory i
         JOIN medicines m ON i.medicine_id = m.id
         WHERE i.store_id = ?
         ORDER BY m.brandName ASC`,
        [store.id]
      );

      const totalQuantity = stockRow ? stockRow.total_quantity || 0 : 0;

      return {
        ...store,
        quantity: totalQuantity,
        total_quantity: totalQuantity,
        medicines: medicines.map((medicine) => medicine.brandName)
      };
    }));

    return res.status(200).json({
      success: true,
      data: formattedStores
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stores'
    });
  }
};

module.exports = {
  getAllStores
};