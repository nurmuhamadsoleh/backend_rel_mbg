const { Op } = require('sequelize');
const { OrganizationInfo } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');

const index = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  const where = search
    ? {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { office_address: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
        { maps_embed: { [Op.like]: `%${search}%` } }
      ]
    }
    : {};

  const data = await OrganizationInfo.findAll({
    where,
    order: [['created_at', 'DESC']]
  });

  return successResponse(res, 'Informasi REL MBG berhasil ditampilkan', data);
});

const store = asyncHandler(async (req, res) => {
  const data = await OrganizationInfo.create({
    title: req.body.title,
    office_address: req.body.office_address,
    phone_number: req.body.phone_number,
    maps_embed: req.body.maps_embed
  });

  return successResponse(res, 'Informasi REL MBG berhasil ditambahkan', data, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await OrganizationInfo.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Informasi REL MBG tidak ditemukan', [], 404);
  }

  await data.update({
    title: req.body.title ?? data.title,
    office_address: req.body.office_address ?? data.office_address,
    phone_number: req.body.phone_number ?? data.phone_number,
    maps_embed: req.body.maps_embed ?? data.maps_embed
  });

  return successResponse(res, 'Informasi REL MBG berhasil diperbarui', data);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await OrganizationInfo.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Informasi REL MBG tidak ditemukan', [], 404);
  }

  await data.destroy();

  return successResponse(res, 'Informasi REL MBG berhasil dihapus', null);
});

module.exports = {
  index,
  store,
  update,
  destroy
};
