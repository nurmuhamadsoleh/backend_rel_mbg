const { body } = require('express-validator');

const createTestimoniValidation = [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('location').optional({ nullable: true, checkFalsy: true }),
  body('description').notEmpty().withMessage('Description wajib diisi')
];

const updateTestimoniValidation = [
  body('name').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('location').optional({ nullable: true, checkFalsy: true }),
  body('description').optional().notEmpty().withMessage('Description tidak boleh kosong')
];

module.exports = {
  createTestimoniValidation,
  updateTestimoniValidation
};
