// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes
router.get('/orders', orderController.getAllOrders);

module.exports = router;