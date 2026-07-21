const { body } = require('express-validator');

const createPendaftaranValidation = [
  body('full_name').notEmpty().withMessage('Nama lengkap wajib diisi'),
  body('whatsapp_number').notEmpty().withMessage('Nomor WhatsApp wajib diisi'),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Email tidak valid'),
  body('nik')
    .notEmpty()
    .withMessage('NIK wajib diisi')
    .bail()
    .isLength({ min: 16, max: 20 })
    .withMessage('NIK minimal 16 dan maksimal 20 karakter'),
  body('full_address').optional({ nullable: true, checkFalsy: true }),
  body('province').optional({ nullable: true, checkFalsy: true }),
  body('regency').optional({ nullable: true, checkFalsy: true }),
  body('district').optional({ nullable: true, checkFalsy: true }),
  body('village').optional({ nullable: true, checkFalsy: true })
];

module.exports = {
  createPendaftaranValidation
};
