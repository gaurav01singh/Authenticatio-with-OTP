const TokenService = require('../services/tokenService');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = TokenService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
