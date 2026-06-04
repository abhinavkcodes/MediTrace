// backend/models/Medicine.js
const pool = require('../config/database');

class Medicine {
  // Get all medicines
  static async getAllMedicines() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM medicines ORDER BY brandName ASC');
      connection.release();
      return rows;
    } catch (error) {
      throw new Error('Error fetching medicines: ' + error.message);
    }
  }

  // Search medicines by brand name or generic name
  static async searchMedicines(query) {
    try {
      const connection = await pool.getConnection();
      const searchTerm = `%${query}%`;
      
      const [rows] = await connection.query(
        'SELECT * FROM medicines WHERE brandName LIKE ? OR genericName LIKE ? OR category LIKE ? ORDER BY brandName ASC',
        [searchTerm, searchTerm, searchTerm]
      );
      
      connection.release();
      return rows;
    } catch (error) {
      throw new Error('Error searching medicines: ' + error.message);
    }
  }

  // Get medicine by ID
  static async getMedicineById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM medicines WHERE id = ?', [id]);
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Error fetching medicine: ' + error.message);
    }
  }

  // Get medicines by category
  static async getMedicinesByCategory(category) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT * FROM medicines WHERE category = ? ORDER BY brandName ASC',
        [category]
      );
      connection.release();
      return rows;
    } catch (error) {
      throw new Error('Error fetching medicines by category: ' + error.message);
    }
  }

  // Get all unique categories
  static async getAllCategories() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT DISTINCT category FROM medicines ORDER BY category ASC'
      );
      connection.release();
      return rows.map(row => row.category);
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message);
    }
  }
}

module.exports = Medicine;
