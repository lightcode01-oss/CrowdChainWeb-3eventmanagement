const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const ticketController = require('../controllers/ticketController');

// Auth Routes
router.post('/auth/wallet-login', authController.walletLogin);

// Event Routes
router.get('/events', eventController.getEvents);
router.post('/events', eventController.createEvent);
router.get('/events/:id', eventController.getEventById);

// Ticket Routes
router.post('/tickets/buy', ticketController.buyTicket);
router.get('/tickets/user/:wallet', ticketController.getUserTickets);
router.post('/tickets/verify', ticketController.verifyTicket);

module.exports = router;
