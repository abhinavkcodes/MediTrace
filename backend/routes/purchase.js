const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.get('/medicine/:name/stores', purchaseController.getMedicineStores);
router.get('/medicine/id/:id/stores', purchaseController.getMedicineStoresById);
router.post('/order', purchaseController.placeOrder);
router.get('/orders/:userId', purchaseController.getUserOrders);

module.exports = router;
