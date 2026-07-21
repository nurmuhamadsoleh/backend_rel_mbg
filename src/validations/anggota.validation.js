const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { body } = require('express-validator');

dayjs.extend(customParseFormat);

function isValidDate(value) {
  return dayjs(value, ['YYYY-MM-DD', 'DD/MM/YYYY'], true).isValid();
}

const createAnggotaValidation = [
  body('name').notEmpty().withMessage('Nama wajib diisi'),
  body('location').notEmpty().withMessage('Lokasi wajib diisi'),
  body('member_number').notEmpty().withMessage('Nomor anggota wajib diisi'),
  body('member_status')
    .notEmpty()
    .withMessage('Status anggota wajib dipilih')
    .bail()
    .isIn(['Aktif', 'Non Aktif'])
    .withMessage('Status anggota harus Aktif atau Non Aktif'),
  body('valid_until')
    .notEmpty()
    .withMessage('Masa berlaku wajib diisi')
    .bail()
    .custom(isValidDate)
    .withMessage('Masa berlaku harus format YYYY-MM-DD atau DD/MM/YYYY')
];

const updateAnggotaValidation = [
  body('name').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('location').optional().notEmpty().withMessage('Lokasi tidak boleh kosong'),
  body('member_number').optional().notEmpty().withMessage('Nomor anggota tidak boleh kosong'),
  body('member_status')
    .optional()
    .isIn(['Aktif', 'Non Aktif'])
    .withMessage('Status anggota harus Aktif atau Non Aktif'),
  body('valid_until')
    .optional({ nullable: true, checkFalsy: true })
    .custom(isValidDate)
    .withMessage('Masa berlaku harus format YYYY-MM-DD atau DD/MM/YYYY')
];

module.exports = {
  createAnggotaValidation,
  updateAnggotaValidation
};
