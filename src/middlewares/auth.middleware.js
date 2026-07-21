const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return errorResponse(res, 'Token tidak ditemukan', [], 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'relmbg_secret_key');
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'photo_url']
    });

    if (!user) {
      return errorResponse(res, 'User tidak ditemukan', [], 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return errorResponse(res, 'Token tidak valid', [], 401);
  }
}

module.exports = authMiddleware;
