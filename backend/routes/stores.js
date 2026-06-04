// backend/routes/stores.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Routes
router.get('/stores', storeController.getAllStores);

module.exports = router;