const mongoose = require('mongoose');

const pricingPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'DT'
  },
  period: {
    type: String,
    default: null
  },
  start_date: {
    type: String,
    default: null
  },
  end_date: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  badge: {
    type: String,
    default: null
  },
  features: {
    type: [String],
    default: []
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'pricing_packages'
});

// Indexes
pricingPackageSchema.index({ is_active: 1, createdAt: -1 });

module.exports = mongoose.model('PricingPackage', pricingPackageSchema);

