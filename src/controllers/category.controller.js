const { Op } = require('sequelize');
const { Category } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');
const slugify = require('../utils/slug');

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = search
    ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } }
      ]
    }
    : {};

  const { rows, count } = await Category.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data kategori berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const show = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return errorResponse(res, 'Data kategori tidak ditemukan', [], 404);
  }

  return successResponse(res, 'Detail kategori berhasil ditampilkan', category);
});

const store = asyncHandler(async (req, res) => {
  const slug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.name);
  const category = await Category.create({
    name: req.body.name,
    slug
  });

  return successResponse(res, 'Data kategori berhasil ditambahkan', category, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return errorResponse(res, 'Data kategori tidak ditemukan', [], 404);
  }

  await category.update({
    name: req.body.name ?? category.name,
    slug: req.body.slug ? slugify(req.body.slug) : (req.body.name ? slugify(req.body.name) : category.slug)
  });

  return successResponse(res, 'Data kategori berhasil diperbarui', category);
});

const destroy = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return errorResponse(res, 'Data kategori tidak ditemukan', [], 404);
  }

  await category.destroy();

  return successResponse(res, 'Data kategori berhasil dihapus', null);
});

module.exports = {
  index,
  show,
  store,
  update,
  destroy
};
