const { body } = require('express-validator');

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
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi')
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
