const { body } = require('express-validator');

const createOrganizationInfoValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title kantor wajib diisi')
    .isLength({ max: 160 })
    .withMessage('Title kantor maksimal 160 karakter'),
  body('office_address')
    .notEmpty()
    .withMessage('Alamat kantor serikat wajib diisi'),
  body('phone_number')
    .notEmpty()
    .withMessage('No telepon wajib diisi')
    .bail()
    .isLength({ max: 40 })
    .withMessage('No telepon maksimal 40 karakter'),
  body('maps_embed')
    .notEmpty()
    .withMessage('Maps wajib diisi')
];

const updateOrganizationInfoValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title kantor tidak boleh kosong')
    .isLength({ max: 160 })
    .withMessage('Title kantor maksimal 160 karakter'),
  body('office_address')
    .optional()
    .notEmpty()
    .withMessage('Alamat kantor serikat tidak boleh kosong'),
  body('phone_number')
    .optional()
    .notEmpty()
    .withMessage('No telepon tidak boleh kosong')
    .bail()
    .isLength({ max: 40 })
    .withMessage('No telepon maksimal 40 karakter'),
  body('maps_embed')
    .optional()
    .notEmpty()
    .withMessage('Maps tidak boleh kosong')
];

module.exports = {
  createOrganizationInfoValidation,
  updateOrganizationInfoValidation
};
