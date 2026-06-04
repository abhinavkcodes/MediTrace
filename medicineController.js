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
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

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
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Medicine ID is required'
      });
    }

    const medicine = await Medicine.getMedicineById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get medicines by category
const getMedicinesByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

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

module.exports = {
  getAllMedicines,
  searchMedicines,
  getMedicineById,
  getMedicinesByCategory,
  getAllCategories
};
