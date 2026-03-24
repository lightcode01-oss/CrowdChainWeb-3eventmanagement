const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect this route with authMiddleware so only logged-in users can buy
router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);

module.exports = router;
