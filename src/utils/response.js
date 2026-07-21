function successResponse(res, message, data = null, meta = undefined, statusCode = 200) {
  const payload = {
    success: true,
    message,
    data
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

function errorResponse(res, message, errors = [], statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

module.exports = {
  successResponse,
  errorResponse
};
