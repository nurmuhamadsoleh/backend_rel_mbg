const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { Op } = require('sequelize');
const { Anggota } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, toPublicUrl } = require('../utils/file');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');

dayjs.extend(customParseFormat);

function parseValidUntil(value) {
  if (!value) {
    return null;
  }

  const parsed = dayjs(value, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
}

function resolveMemberStatus(requestedStatus, fallbackStatus = 'Aktif') {
  return requestedStatus || fallbackStatus || 'Aktif';
}

async function resolvePhoto(file) {
  if (!file) {
    return null;
  }

  const webpPath = await convertToWebp(file.path);
  return toPublicUrl(webpPath);
}

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { member_number: { [Op.like]: `%${search}%` } }
      ]
    }
    : {};

  if (req.query.member_status) {
    where.member_status = req.query.member_status;
  }

  const { rows, count } = await Anggota.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data anggota relawan berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const show = asyncHandler(async (req, res) => {
  const data = await Anggota.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data anggota relawan tidak ditemukan', [], 404);
  }

  return successResponse(res, 'Detail anggota relawan berhasil ditampilkan', data);
});

const store = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Photo wajib diupload', [], 422);
  }

  const photo_url = await resolvePhoto(req.file);
  const validUntil = parseValidUntil(req.body.valid_until);
  const data = await Anggota.create({
    name: req.body.name,
    location: req.body.location,
    member_number: req.body.member_number,
    photo_url,
    valid_until: validUntil,
    member_status: resolveMemberStatus(req.body.member_status)
  });

  return successResponse(res, 'Data anggota relawan berhasil ditambahkan', data, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await Anggota.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data anggota relawan tidak ditemukan', [], 404);
  }

  const photo_url = await resolvePhoto(req.file);
  const validUntil = req.body.valid_until
    ? parseValidUntil(req.body.valid_until)
    : data.valid_until;

  if (photo_url) {
    deleteLocalFile(data.photo_url);
  }

  await data.update({
    name: req.body.name ?? data.name,
    location: req.body.location ?? data.location,
    member_number: req.body.member_number ?? data.member_number,
    photo_url: photo_url ?? data.photo_url,
    valid_until: validUntil,
    member_status: resolveMemberStatus(req.body.member_status, data.member_status)
  });

  return successResponse(res, 'Data anggota relawan berhasil diperbarui', data);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await Anggota.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data anggota relawan tidak ditemukan', [], 404);
  }

  deleteLocalFile(data.photo_url);
  await data.destroy();

  return successResponse(res, 'Data anggota relawan berhasil dihapus', null);
});

module.exports = {
  index,
  show,
  store,
  update,
  destroy
};
