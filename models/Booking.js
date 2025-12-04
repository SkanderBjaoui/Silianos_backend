const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  service_type: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    default: null
  },
  departure_date: {
    type: String,
    required: true
  },
  return_date: {
    type: String,
    default: null
  },
  number_of_travelers: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'failed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: null
  },
  total_amount: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: 'TND'
  },
  pricing_package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PricingPackage',
    default: null
  },
  package_currency: {
    type: String,
    default: null
  },
  price_snapshot: {
    type: Number,
    default: null
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    default: null
  }
}, {
  timestamps: true,
  collection: 'bookings'
});

// Indexes
bookingSchema.index({ user_id: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ pricing_package_id: 1 });
bookingSchema.index({ service_id: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

