const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

/**
 * Generate JWT token
 */
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Register new user
 */
async function registerUser(email, password, name) {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create new user
  const user = new User({
    email,
    password,
    name,
    provider: 'local',
  });

  await user.save();
  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
}

/**
 * Login user
 */
async function loginUser(email, password) {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.toJSON();
}

/**
 * Find or create OAuth user
 */
async function findOrCreateOAuthUser(email, name, provider, providerId, avatar = null) {
  let user = await User.findOne({ email });

  if (user) {
    // Update OAuth info if not set
    if (!user.providerId) {
      user.provider = provider;
      user.providerId = providerId;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
  } else {
    // Create new user from OAuth
    user = new User({
      email,
      name,
      provider,
      providerId,
      avatar,
      password: Math.random().toString(36), // Random password for OAuth users
    });
    await user.save();
  }

  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
}

module.exports = {
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  getUserById,
  findOrCreateOAuthUser,
};
