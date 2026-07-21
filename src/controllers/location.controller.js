const { Op } = require('sequelize');
const { Location } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, toPublicUrl } = require('../utils/file');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');

function trimValue(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const next = String(value).trim();
  return next.length ? next : null;
}

function normalizeNumber(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

async function resolvePhoto(file) {
  if (!file) {
    return null;
  }

  const webpPath = await convertToWebp(file.path);
  return toPublicUrl(webpPath);
}

function buildLocationAttributes(body = {}, options = {}) {
  const useDefaults = Boolean(options.defaults);

  return {
    name: trimValue(body.name) || (useDefaults ? 'Kantor Serikat REL MBG' : null),
    level: trimValue(body.level) || (useDefaults ? 'DPC' : null),
    address: trimValue(body.address),
    province_id: trimValue(body.province_id) || (useDefaults ? '' : null),
    province_name: trimValue(body.province_name) || (useDefaults ? '' : null),
    city_id: trimValue(body.city_id) || (useDefaults ? '' : null),
    city_name: trimValue(body.city_name) || (useDefaults ? '' : null),
    district_id: trimValue(body.district_id) || (useDefaults ? '' : null),
    district_name: trimValue(body.district_name) || (useDefaults ? '' : null),
    village_id: trimValue(body.village_id) || (useDefaults ? '' : null),
    village_name: trimValue(body.village_name) || (useDefaults ? '' : null),
    latitude: normalizeNumber(body.latitude),
    longitude: normalizeNumber(body.longitude),
    contact_number: trimValue(body.contact_number) || (useDefaults ? '' : null),
    email: trimValue(body.email) || (useDefaults ? '' : null),
    coverage_radius: normalizeNumber(body.coverage_radius) ?? (useDefaults ? 5 : null),
    coverage_geojson: trimValue(body.coverage_geojson),
    status: trimValue(body.status) || (useDefaults ? 'Aktif' : null)
  };
}

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { level: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { province_name: { [Op.like]: `%${search}%` } },
        { city_name: { [Op.like]: `%${search}%` } },
        { district_name: { [Op.like]: `%${search}%` } },
        { village_name: { [Op.like]: `%${search}%` } },
        { contact_number: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } }
      ]
    }
    : {};

  if (req.query.status) {
    where.status = req.query.status;
  }

  if (req.query.level) {
    where.level = req.query.level;
  }

  const { rows, count } = await Location.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data lokasi berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const publicIndex = asyncHandler(async (req, res) => {
  const data = await Location.findAll({
    where: { status: 'Aktif' },
    order: [['created_at', 'DESC']]
  });

  return successResponse(res, 'Data lokasi publik berhasil ditampilkan', data);
});

const store = asyncHandler(async (req, res) => {
  const photo_url = await resolvePhoto(req.file);
  const payload = buildLocationAttributes(req.body, { defaults: true });

  const data = await Location.create({
    ...payload,
    photo_url
  });

  return successResponse(res, 'Data lokasi berhasil ditambahkan', data, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await Location.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data lokasi tidak ditemukan', [], 404);
  }

  const photo_url = await resolvePhoto(req.file);
  const payload = buildLocationAttributes(req.body);

  if (photo_url) {
    deleteLocalFile(data.photo_url);
  }

  await data.update({
    ...Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== null)
    ),
    photo_url: photo_url ?? data.photo_url
  });

  return successResponse(res, 'Data lokasi berhasil diperbarui', data);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await Location.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data lokasi tidak ditemukan', [], 404);
  }

  deleteLocalFile(data.photo_url);
  await data.destroy();

  return successResponse(res, 'Data lokasi berhasil dihapus', null);
});

module.exports = {
  index,
  publicIndex,
  store,
  update,
  destroy
};
