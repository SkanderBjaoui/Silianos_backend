const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  about: {
    type: String,
    default: null
  },
  image: {
    type: String,
    required: true
  },
  // icon and color fields removed intentionally
  price: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'TND'
  },
  country: {
    type: String,
    default: null
  },
  // Optional legacy start/end dates (kept for backward compatibility)
  start_date: {
    type: String,
    default: null
  },
  end_date: {
    type: String,
    default: null
  },
  // New: maximum duration in days defined by admin
  duration_days: {
    type: Number,
    default: null
  },
  features: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  display_order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'services'
});

// Indexes
serviceSchema.index({ status: 1, display_order: 1 });

module.exports = mongoose.model('Service', serviceSchema);