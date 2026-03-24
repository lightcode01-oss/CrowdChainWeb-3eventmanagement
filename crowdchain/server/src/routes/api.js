const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const ticketController = require('../controllers/ticketController');
const paymentRoutes = require('./payment');
const authMiddleware = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/wallet-login', authController.walletLogin);

// Event Routes
router.get('/events', eventController.getEvents);
router.post('/events', eventController.createEvent);
router.get('/events/:id', eventController.getEventById);
router.delete('/events/:id', authMiddleware, eventController.deleteEvent);

// Ticket Routes
router.post('/tickets/buy', ticketController.buyTicket);
router.get('/tickets/user/:wallet', ticketController.getUserTickets);
router.post('/tickets/verify', authMiddleware, ticketController.verifyTicket);
// Payment Routes
router.use('/payment', paymentRoutes);

module.exports = router;
