const User = require('../models/User');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const formatAppUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  phone: user.phone || undefined,
  preferredCurrency: user.preferred_currency || 'TND',
  createdAt: user.createdAt
});

// ============================================
// REGULAR USER AUTHENTICATION
// ============================================

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: formatAppUser(user)
    });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.userRegister = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name,
      phone: phone || null
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: formatAppUser(newUser)
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ============================================
// ADMIN AUTHENTICATION
// ============================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await AdminUser.findOne({ 
      email: email.toLowerCase(),
      is_active: true 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user exists
    const existing = await AdminUser.findOne({
      $or: [
        { username: username },
        { email: email.toLowerCase() }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await AdminUser.create({
      username,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: full_name || null
    });

    res.status(201).json({
      id: newUser._id.toString(),
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error during admin registration:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin or user token
    if (decoded.type === 'admin') {
      const user = await AdminUser.findOne({ 
        _id: decoded.id,
        is_active: true 
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Generate a new token to refresh the expiration timer
      const newToken = jwt.sign(
        { id: user._id.toString(), username: user.username, type: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token: newToken, 
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          full_name: user.full_name
        }, 
        type: 'admin' 
      });
    } else if (decoded.type === 'user') {
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Generate a new token to refresh the 7-day expiration timer
      const newToken = jwt.sign(
        { id: user._id.toString(), email: user.email, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        token: newToken,
        user: formatAppUser(user),
        type: 'user' 
      });
    } else {
      return res.status(401).json({ error: 'Invalid token type' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'user') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, email, phone, preferred_currency, preferredCurrency } = req.body;
    const currencyPreference = preferred_currency || preferredCurrency;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existing = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: decoded.id }
      });

      if (existing) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
    }

    // Build update object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (phone !== undefined) updates.phone = phone || null;
    if (currencyPreference) updates.preferred_currency = currencyPreference;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: formatAppUser(updatedUser)
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
