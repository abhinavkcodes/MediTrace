// backend/routes/medicines.js
const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Routes
router.get('/medicines', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicines);
router.get('/categories', medicineController.getAllCategories);
router.get('/medicine/id/:id/stores', medicineController.getStoresForMedicine);
router.get('/medicines/category/:category', medicineController.getMedicinesByCategory);
router.get('/medicines/:id', medicineController.getMedicineById);

module.exports = router;
