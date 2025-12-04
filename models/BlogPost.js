const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    default: 'Silianos Voyage'
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Général'
  },
  tags: {
    type: [String],
    default: []
  },
  published: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'blog_posts'
});

// Indexes
blogPostSchema.index({ published: 1, date: -1 });
blogPostSchema.index({ category: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);




