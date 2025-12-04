const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  customer_image: {
    type: String,
    default: null
  },
  service: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'testimonials'
});

// Index
testimonialSchema.index({ verified: 1, createdAt: -1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);

