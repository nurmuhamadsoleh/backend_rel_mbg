const { Op } = require('sequelize');
const { Contact } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } }
      ]
    }
    : {};

  if (req.query.status) {
    where.status = req.query.status;
  }

  const { rows, count } = await Contact.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data kontak berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const store = asyncHandler(async (req, res) => {
  const data = await Contact.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    message: req.body.message
  });

  return successResponse(res, 'Pesan kontak berhasil dikirim', data, undefined, 201);
});

const show = asyncHandler(async (req, res) => {
  const data = await Contact.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data kontak tidak ditemukan', [], 404);
  }

  if (data.status === 'unread') {
    await data.update({ status: 'read' });
  }

  return successResponse(res, 'Detail kontak berhasil ditampilkan', data);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await Contact.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data kontak tidak ditemukan', [], 404);
  }

  await data.destroy();

  return successResponse(res, 'Data kontak berhasil dihapus', null);
});

module.exports = {
  index,
  store,
  show,
  destroy
};
