const { body } = require('express-validator');

const createProgramValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title wajib diisi')
    .bail()
    .isLength({ max: 180 })
    .withMessage('Title maksimal 180 karakter'),
  body('subtitle')
    .notEmpty()
    .withMessage('Subtitle wajib diisi')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Subtitle maksimal 255 karakter'),
  body('description')
    .notEmpty()
    .withMessage('Deskripsi wajib diisi'),
  body('status')
    .optional()
    .isIn(['publish', 'unpublish'])
    .withMessage('Status harus publish atau unpublish')
];

const updateProgramValidation = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title tidak boleh kosong')
    .bail()
    .isLength({ max: 180 })
    .withMessage('Title maksimal 180 karakter'),
  body('subtitle')
    .optional()
    .notEmpty()
    .withMessage('Subtitle tidak boleh kosong')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Subtitle maksimal 255 karakter'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Deskripsi tidak boleh kosong'),
  body('status')
    .optional()
    .isIn(['publish', 'unpublish'])
    .withMessage('Status harus publish atau unpublish')
];

module.exports = {
  createProgramValidation,
  updateProgramValidation
};
