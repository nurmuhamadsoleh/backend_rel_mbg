const { body } = require('express-validator');

const createStrukturValidation = [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('position').notEmpty().withMessage('Jabatan wajib diisi')
];

const updateStrukturValidation = [
  body('name').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('position').optional().notEmpty().withMessage('Jabatan tidak boleh kosong')
];

module.exports = {
  createStrukturValidation,
  updateStrukturValidation
};
