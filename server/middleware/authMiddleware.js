const { verifyToken } = require('../services/authService');

/**
 * Middleware to verify JWT token
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    // Attach userId to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
