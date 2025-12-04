const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'admin_users'
});

module.exports = mongoose.model('AdminUser', adminUserSchema);

