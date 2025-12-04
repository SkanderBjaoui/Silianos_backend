const Booking = require('../models/Booking');

const formatBooking = (booking) => ({
  id: booking._id.toString(),
  user_id: booking.user_id ? booking.user_id.toString() : null,
  service_id: booking.service_id ? booking.service_id.toString() : null,
  customer_name: booking.customer_name,
  email: booking.email,
  phone: booking.phone,
  service_type: booking.service_type,
  destination: booking.destination,
  departure_date: booking.departure_date,
  return_date: booking.return_date,
  number_of_travelers: booking.number_of_travelers,
  status: booking.status,
  payment_status: booking.payment_status,
  notes: booking.notes,
  total_amount: booking.total_amount,
  currency: booking.currency,
  pricing_package_id: booking.pricing_package_id ? booking.pricing_package_id.toString() : null,
  package_currency: booking.package_currency,
  price_snapshot: booking.price_snapshot,
  created_at: booking.createdAt,
  updated_at: booking.updatedAt
});

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    res.json(bookings.map(formatBooking));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).lean();
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(formatBooking(booking));
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      user_id,
      service_id,
      customer_name,
      email,
      phone,
      service_type,
      destination,
      departure_date,
      return_date,
      number_of_travelers,
      notes,
      total_amount,
      currency,
      pricing_package_id,
      package_currency,
      price_snapshot
    } = req.body;

    const booking = await Booking.create({
      user_id: user_id || null,
      service_id: service_id || null,
      customer_name,
      email,
      phone,
      service_type,
      destination: destination || null,
      departure_date,
      return_date: return_date || null,
      number_of_travelers: number_of_travelers || 1,
      notes: notes || null,
      total_amount: total_amount || null,
      currency: currency || package_currency || 'TND',
      pricing_package_id: pricing_package_id || null,
      package_currency: package_currency || null,
      price_snapshot: price_snapshot || total_amount || null
    });

    res.status(201).json({
      id: booking._id.toString(),
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Update booking status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!['pending', 'approved', 'paid', 'failed'].includes(payment_status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { payment_status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

