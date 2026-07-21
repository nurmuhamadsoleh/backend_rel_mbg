const { validationResult } = require('express-validator');
const { deleteUploadedFiles } = require('../utils/file');
const { errorResponse } = require('../utils/response');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    deleteUploadedFiles(req);
    return errorResponse(res, 'Validation error', errors.array(), 422);
  }

  return next();
};
