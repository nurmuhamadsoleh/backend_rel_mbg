const { body } = require('express-validator');

const baseGalleryValidation = [
  body('category_id')
    .notEmpty()
    .withMessage('Category wajib dipilih')
    .bail()
    .isInt()
    .withMessage('Category tidak valid'),
  body('title')
    .notEmpty()
    .withMessage('Title wajib diisi')
    .bail()
    .isLength({ max: 180 })
    .withMessage('Title maksimal 180 karakter'),
  body('short_description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('Short description maksimal 255 karakter'),
  body('file_type')
    .optional()
    .isIn(['image', 'video'])
    .withMessage('File type harus image atau video'),
  body('meta_description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('Meta description maksimal 255 karakter'),
  body('meta_keywords')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('Meta keywords maksimal 255 karakter'),
  body('status')
    .optional()
    .isIn(['publish', 'unpublish'])
    .withMessage('Status harus publish atau unpublish')
];

const updateGalleryValidation = [
  body('category_id').optional().isInt().withMessage('Category tidak valid'),
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title tidak boleh kosong')
    .bail()
    .isLength({ max: 180 })
    .withMessage('Title maksimal 180 karakter'),
  body('short_description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('Short description maksimal 255 karakter'),
  body('file_type')
    .optional()
    .isIn(['image', 'video'])
    .withMessage('File type harus image atau video'),
  body('meta_description')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('Meta description maksimal 255 karakter'),
  body('meta_keywords')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('Meta keywords maksimal 255 karakter'),
  body('status')
    .optional()
    .isIn(['publish', 'unpublish'])
    .withMessage('Status harus publish atau unpublish')
];

module.exports = {
  createGalleryValidation: baseGalleryValidation,
  updateGalleryValidation
};
