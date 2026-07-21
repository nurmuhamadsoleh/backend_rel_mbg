const { Op } = require('sequelize');
const { Category, Gallery } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, deleteUploadedFiles, ensureImageSize, ensureVideoSize, toPublicUrl } = require('../utils/file');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');

async function resolveGalleryFile(file, requestedType) {
  if (!file) {
    return null;
  }

  const inferredType = file.mimetype === 'video/mp4' ? 'video' : 'image';

  if (requestedType && requestedType !== inferredType) {
    deleteLocalFile(toPublicUrl(file.path));
    const error = new Error('File type tidak sesuai dengan file yang diupload');
    error.status = 422;
    throw error;
  }

  if (inferredType === 'image') {
    ensureImageSize(file);
    const webpPath = await convertToWebp(file.path);
    return {
      file_type: 'image',
      file_url: toPublicUrl(webpPath)
    };
  }

  ensureVideoSize(file);

  return {
    file_type: 'video',
    file_url: toPublicUrl(file.path)
  };
}

async function ensureCategoryExists(categoryId, req, res) {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    deleteUploadedFiles(req);
    errorResponse(res, 'Category tidak ditemukan', [], 404);
    return false;
  }

  return true;
}

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = {};

  if (req.query.status) {
    where.status = req.query.status;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { short_description: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } }
    ];
  }

  const { rows, count } = await Gallery.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category' }],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data gallery berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const publicIndex = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = {
    status: 'publish'
  };

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { short_description: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } }
    ];
  }

  const { rows, count } = await Gallery.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category' }],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Artikel publik berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const show = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.id, {
    include: [{ model: Category, as: 'category' }]
  });

  if (!gallery) {
    return errorResponse(res, 'Data gallery tidak ditemukan', [], 404);
  }

  return successResponse(res, 'Detail gallery berhasil ditampilkan', gallery);
});

const publicShow = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findOne({
    where: {
      id: req.params.id,
      status: 'publish'
    },
    include: [{ model: Category, as: 'category' }]
  });

  if (!gallery) {
    return errorResponse(res, 'Artikel publik tidak ditemukan', [], 404);
  }

  return successResponse(res, 'Detail artikel publik berhasil ditampilkan', gallery);
});

const store = asyncHandler(async (req, res) => {
  if (!(await ensureCategoryExists(req.body.category_id, req, res))) {
    return null;
  }

  if (!req.file) {
    return errorResponse(res, 'File wajib diupload', [], 422);
  }

  const fileData = await resolveGalleryFile(req.file, req.body.file_type);
  const gallery = await Gallery.create({
    category_id: req.body.category_id,
    title: req.body.title,
    short_description: req.body.short_description,
    content: req.body.content,
    meta_description: req.body.meta_description,
    meta_keywords: req.body.meta_keywords,
    status: req.body.status || 'unpublish',
    ...fileData
  });

  return successResponse(res, 'Data gallery berhasil ditambahkan', gallery, undefined, 201);
});

const update = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.id);

  if (!gallery) {
    return errorResponse(res, 'Data gallery tidak ditemukan', [], 404);
  }

  if (req.body.category_id && !(await ensureCategoryExists(req.body.category_id, req, res))) {
    return null;
  }

  const fileData = await resolveGalleryFile(req.file, req.body.file_type);

  if (fileData) {
    deleteLocalFile(gallery.file_url);
  }

  await gallery.update({
    category_id: req.body.category_id ?? gallery.category_id,
    title: req.body.title ?? gallery.title,
    short_description: req.body.short_description ?? gallery.short_description,
    content: req.body.content ?? gallery.content,
    meta_description: req.body.meta_description ?? gallery.meta_description,
    meta_keywords: req.body.meta_keywords ?? gallery.meta_keywords,
    status: req.body.status ?? gallery.status,
    ...(fileData || {})
  });

  return successResponse(res, 'Data gallery berhasil diperbarui', gallery);
});

const destroy = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.id);

  if (!gallery) {
    return errorResponse(res, 'Data gallery tidak ditemukan', [], 404);
  }

  deleteLocalFile(gallery.file_url);
  await gallery.destroy();

  return successResponse(res, 'Data gallery berhasil dihapus', null);
});

module.exports = {
  index,
  publicIndex,
  show,
  publicShow,
  store,
  update,
  destroy
};
