const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { ensureImageSize, toPublicUrl } = require('../utils/file');
const { errorResponse, successResponse } = require('../utils/response');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Image wajib diupload', [], 422);
  }

  ensureImageSize(req.file);
  const webpPath = await convertToWebp(req.file.path);

  return successResponse(res, 'Image editor berhasil diupload', {
    url: toPublicUrl(webpPath)
  }, undefined, 201);
});

module.exports = {
  uploadImage
};
