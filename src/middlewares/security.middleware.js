const { errorResponse } = require('../utils/response');
const { hasDangerousObjectKey } = require('../utils/security');

const attempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

function rejectDangerousPayload(req, res, next) {
  if (hasDangerousObjectKey(req.body) || hasDangerousObjectKey(req.query) || hasDangerousObjectKey(req.params)) {
    return errorResponse(res, 'Payload tidak valid', [], 400);
  }

  return next();
}

function loginRateLimiter(req, res, next) {
  const key = `${req.ip || 'unknown'}:${String(req.body?.email || '').toLowerCase()}`;
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + LOGIN_WINDOW_MS };

  if (record.resetAt <= now) {
    record.count = 0;
    record.resetAt = now + LOGIN_WINDOW_MS;
  }

  record.count += 1;
  attempts.set(key, record);

  if (record.count > LOGIN_MAX_ATTEMPTS) {
    return errorResponse(res, 'Terlalu banyak percobaan login. Silakan coba lagi beberapa menit.', [], 429);
  }

  res.on('finish', () => {
    if (res.statusCode < 400) {
      attempts.delete(key);
    }
  });

  return next();
}

module.exports = {
  loginRateLimiter,
  rejectDangerousPayload
};
