const { Struktur } = require('../models');
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
  const data = await Struktur.findAll({
    order: [['created_at', 'DESC']]
  });

  return successResponse(res, 'Data struktur organisasi berhasil ditampilkan', data);
});

const store = asyncHandler(async (req, res) => {
  const photo_url = await resolvePhoto(req.file);
  const data = await Struktur.create({
    name: req.body.name,
    position: req.body.position,
    photo_url
  });

  return successResponse(res, 'Data struktur organisasi berhasil ditambahkan', data, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await Struktur.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data struktur organisasi tidak ditemukan', [], 404);
  }

  const photo_url = await resolvePhoto(req.file);

  if (photo_url) {
    deleteLocalFile(data.photo_url);
  }

  await data.update({
    name: req.body.name ?? data.name,
    position: req.body.position ?? data.position,
    photo_url: photo_url ?? data.photo_url
  });

  return successResponse(res, 'Data struktur organisasi berhasil diperbarui', data);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await Struktur.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data struktur organisasi tidak ditemukan', [], 404);
  }

  deleteLocalFile(data.photo_url);
  await data.destroy();

  return successResponse(res, 'Data struktur organisasi berhasil dihapus', null);
});

module.exports = {
  index,
  store,
  update,
  destroy
};
