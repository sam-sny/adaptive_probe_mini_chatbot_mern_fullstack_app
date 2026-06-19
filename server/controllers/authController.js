const authService = require('../services/authService');

/**
 * Register new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      const err = new Error('Email, password, and name are required');
      err.statusCode = 400;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error('Password must be at least 6 characters');
      err.statusCode = 400;
      throw err;
    }

    const result = await authService.registerUser(email, password, name);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 401;
    next(err);
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (frontend will clear token)
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
