const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true,
    default: 'Général'
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true,
  collection: 'gallery_images'
});

// Indexes
galleryImageSchema.index({ category: 1 });
galleryImageSchema.index({ date: -1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);

