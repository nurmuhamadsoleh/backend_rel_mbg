const { body } = require('express-validator');

const createContactValidation = [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('phone').optional({ nullable: true, checkFalsy: true }),
  body('address').optional({ nullable: true, checkFalsy: true }),
  body('message').notEmpty().withMessage('Pesan wajib diisi')
];

module.exports = {
  createContactValidation
};
