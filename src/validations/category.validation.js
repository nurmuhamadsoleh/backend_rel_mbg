const { body } = require('express-validator');

const createCategoryValidation = [
  body('name').notEmpty().withMessage('Nama kategori wajib diisi'),
  body('slug')
    .optional()
    .isLength({ max: 120 })
    .withMessage('Slug maksimal 120 karakter')
];

const updateCategoryValidation = [
  body('name').optional().notEmpty().withMessage('Nama kategori tidak boleh kosong'),
  body('slug')
    .optional()
    .isLength({ max: 120 })
    .withMessage('Slug maksimal 120 karakter')
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation
};
