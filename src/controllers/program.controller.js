const { Op } = require('sequelize');
const { Program } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, ensureImageSize, toPublicUrl } = require('../utils/file');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');

async function resolveProgramFlyer(file) {
  if (!file) {
    return null;
  }

  ensureImageSize(file);
  const webpPath = await convertToWebp(file.path);

  return toPublicUrl(webpPath);
}

function buildSearchWhere(search, baseWhere = {}) {
  if (!search) {
    return baseWhere;
  }

  return {
    ...baseWhere,
    [Op.or]: [
      { title: { [Op.like]: `%${search}%` } },
      { subtitle: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ]
  };
}

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = buildSearchWhere(req.query.search || '', req.query.status ? { status: req.query.status } : {});

  const { rows, count } = await Program.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data program berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const publicIndex = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = buildSearchWhere(req.query.search || '', { status: 'publish' });

  const { rows, count } = await Program.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Program publik berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const show = asyncHandler(async (req, res) => {
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return errorResponse(res, 'Data program tidak ditemukan', [], 404);
  }

  return successResponse(res, 'Detail program berhasil ditampilkan', program);
});

const store = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Flyer wajib diupload', [], 422);
  }

  const flyerUrl = await resolveProgramFlyer(req.file);
  const program = await Program.create({
    flyer_url: flyerUrl,
    title: req.body.title,
    subtitle: req.body.subtitle,
    description: req.body.description,
    status: req.body.status || 'publish'
  });

  return successResponse(res, 'Data program berhasil ditambahkan', program, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return errorResponse(res, 'Data program tidak ditemukan', [], 404);
  }

  const flyerUrl = await resolveProgramFlyer(req.file);

  if (flyerUrl) {
    deleteLocalFile(program.flyer_url);
  }

  await program.update({
    flyer_url: flyerUrl || program.flyer_url,
    title: req.body.title ?? program.title,
    subtitle: req.body.subtitle ?? program.subtitle,
    description: req.body.description ?? program.description,
    status: req.body.status ?? program.status
  });

  return successResponse(res, 'Data program berhasil diperbarui', program);
});

const destroy = asyncHandler(async (req, res) => {
  const program = await Program.findByPk(req.params.id);

  if (!program) {
    return errorResponse(res, 'Data program tidak ditemukan', [], 404);
  }

  deleteLocalFile(program.flyer_url);
  await program.destroy();

  return successResponse(res, 'Data program berhasil dihapus', null);
});

module.exports = {
  index,
  publicIndex,
  show,
  store,
  update,
  destroy
};
