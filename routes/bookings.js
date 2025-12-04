const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Create new booking
router.post('/', bookingController.createBooking);

// Update booking status
router.patch('/:id/status', bookingController.updateStatus);

// Update payment status
router.patch('/:id/payment', bookingController.updatePaymentStatus);

// Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

