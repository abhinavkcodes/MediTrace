// backend/controllers/medicineController.js
const Medicine = require('../models/Medicine');

// Get all medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.getAllMedicines();
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search medicines
const searchMedicines = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  try {
    const medicines = await Medicine.searchMedicines(q.trim());
    res.status(200).json({
      success: true,
      query: q,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get medicine by ID
const getMedicineById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Medicine ID is required'
    });
  }

  try {
    const medicine = await Medicine.getMedicineById(id);
    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    } else {
      res.status(200).json({
        success: true,
        data: medicine
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get medicines by category
const getMedicinesByCategory = async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({
      success: false,
      message: 'Category is required'
    });
  }

  try {
    const medicines = await Medicine.getMedicinesByCategory(category);
    res.status(200).json({
      success: true,
      category: category,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Medicine.getAllCategories();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get stores for a specific medicine
const getStoresForMedicine = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Medicine ID is required'
    });
  }

  try {
    const db = require('../config/database');
    
    // Get the medicine details
    const medicine = await db.get('SELECT * FROM medicines WHERE id = ?', [id]);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Get stores that have this medicine in inventory
    const stores = await db.all(
      `SELECT s.*, i.quantity 
       FROM stores s 
       LEFT JOIN inventory i ON s.id = i.store_id AND i.medicine_id = ?
       ORDER BY s.city, s.name ASC`,
      [id]
    );

    res.status(200).json({
      success: true,
      medicine: medicine,
      stores: stores.map(store => ({
        ...store,
        quantity: store.quantity != null ? store.quantity : 0
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllMedicines,
  searchMedicines,
  getMedicineById,
  getMedicinesByCategory,
  getAllCategories,
  getStoresForMedicine
};
