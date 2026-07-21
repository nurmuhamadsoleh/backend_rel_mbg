const { Testimoni } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, toPublicUrl } = require('../utils/file');
const { successResponse, errorResponse } = require('../utils/response');

async function resolvePhoto(file) {
  if (!file) {
    return null;
  }

  const webpPath = await convertToWebp(file.path);
  return toPublicUrl(webpPath);
}

const index = asyncHandler(async (req, res) => {
  const data = await Testimoni.findAll({
    order: [['created_at', 'DESC']]
  });

  return successResponse(res, 'Data testimoni berhasil ditampilkan', data);
});

const store = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Photo wajib diupload', [], 422);
  }

  const photo_url = await resolvePhoto(req.file);
  const data = await Testimoni.create({
    photo_url,
    name: req.body.name,
    location: req.body.location,
    description: req.body.description
  });

  return successResponse(res, 'Data testimoni berhasil ditambahkan', data, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await Testimoni.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data testimoni tidak ditemukan', [], 404);
  }

  const photo_url = await resolvePhoto(req.file);

  if (photo_url) {
    deleteLocalFile(data.photo_url);
  }

  await data.update({
    photo_url: photo_url ?? data.photo_url,
    name: req.body.name ?? data.name,
    location: req.body.location ?? data.location,
    description: req.body.description ?? data.description
  });

  return successResponse(res, 'Data testimoni berhasil diperbarui', data);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await Testimoni.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data testimoni tidak ditemukan', [], 404);
  }

  deleteLocalFile(data.photo_url);
  await data.destroy();

  return successResponse(res, 'Data testimoni berhasil dihapus', null);
});

module.exports = {
  index,
  store,
  update,
  destroy
};
