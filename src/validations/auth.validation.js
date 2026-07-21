const { body } = require('express-validator');
const { hasSqlInjectionPattern } = require('../utils/security');

function rejectSqlInjection(value) {
  if (hasSqlInjectionPattern(value)) {
    throw new Error('Input mengandung karakter atau pola yang tidak diperbolehkan');
  }

  return true;
}

const registerValidation = [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
  body('role')
    .optional()
    .isIn(['admin', 'editor'])
    .withMessage('Role harus admin atau editor')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email atau username wajib diisi')
    .bail()
    .isLength({ max: 120 })
    .withMessage('Email atau username maksimal 120 karakter')
    .bail()
    .custom(rejectSqlInjection),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .bail()
    .isLength({ min: 6, max: 128 })
    .withMessage('Password minimal 6 karakter dan maksimal 128 karakter')
    .bail()
    .custom(rejectSqlInjection)
];

const updateProfileValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Username wajib diisi')
    .isLength({ max: 120 })
    .withMessage('Username maksimal 120 karakter'),
  body('password')
    .optional({ values: 'falsy' })
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation
};
