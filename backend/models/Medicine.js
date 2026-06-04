// backend/models/Medicine.js
const db = require('../config/database');

class Medicine {
  static async getAllMedicines() {
    try {
      return await db.all('SELECT * FROM medicines ORDER BY brandName ASC');
    } catch (error) {
      throw error;
    }
  }

  static async searchMedicines(query) {
    try {
      const searchTerm = `%${query}%`;
      return await db.all(
        'SELECT * FROM medicines WHERE brandName LIKE ? OR genericName LIKE ? OR category LIKE ? ORDER BY brandName ASC',
        [searchTerm, searchTerm, searchTerm]
      );
    } catch (error) {
      throw error;
    }
  }

  static async getMedicineById(id) {
    try {
      return await db.get('SELECT * FROM medicines WHERE id = ?', [id]);
    } catch (error) {
      throw error;
    }
  }

  static async getMedicinesByCategory(category) {
    try {
      return await db.all(
        'SELECT * FROM medicines WHERE category = ? ORDER BY brandName ASC',
        [category]
      );
    } catch (error) {
      throw error;
    }
  }

  static async getAllCategories() {
    try {
      const rows = await db.all('SELECT DISTINCT category FROM medicines ORDER BY category ASC');
      return rows.map(row => row.category);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Medicine;
