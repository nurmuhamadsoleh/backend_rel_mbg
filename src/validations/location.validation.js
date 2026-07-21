const { body } = require('express-validator');

const createLocationValidation = [
  body('name').notEmpty().withMessage('Nama kantor serikat wajib diisi'),
  body('level').optional({ nullable: true, checkFalsy: true }).isIn(['DPW', 'DPD', 'DPC', 'PAC']).withMessage('Level lokasi tidak valid'),
  body('address').notEmpty().withMessage('Alamat kantor serikat wajib diisi'),
  body('province_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('province_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('city_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('city_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('district_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('district_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('village_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('village_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('latitude').isFloat().withMessage('Latitude tidak valid'),
  body('longitude').isFloat().withMessage('Longitude tidak valid'),
  body('contact_number').notEmpty().withMessage('Nomor telepon wajib diisi').isLength({ max: 40 }),
  body('email').notEmpty().withMessage('Email wajib diisi').isEmail().withMessage('Format email tidak valid').isLength({ max: 160 }),
  body('coverage_radius').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Coverage radius tidak valid'),
  body('coverage_geojson').optional({ nullable: true, checkFalsy: true }),
  body('status').optional({ nullable: true, checkFalsy: true }).isIn(['Aktif', 'Non Aktif']).withMessage('Status lokasi tidak valid')
];

const updateLocationValidation = [
  body('name').optional().notEmpty().withMessage('Nama kantor serikat tidak boleh kosong'),
  body('level').optional().isIn(['DPW', 'DPD', 'DPC', 'PAC']).withMessage('Level lokasi tidak valid'),
  body('address').optional().notEmpty().withMessage('Alamat kantor serikat tidak boleh kosong'),
  body('province_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('province_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('city_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('city_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('district_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('district_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('village_id').optional({ nullable: true, checkFalsy: true }).isLength({ max: 20 }),
  body('village_name').optional({ nullable: true, checkFalsy: true }).isLength({ max: 120 }),
  body('latitude').optional().isFloat().withMessage('Latitude tidak valid'),
  body('longitude').optional().isFloat().withMessage('Longitude tidak valid'),
  body('contact_number').optional({ nullable: true, checkFalsy: true }).isLength({ max: 40 }),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Format email tidak valid').isLength({ max: 160 }),
  body('coverage_radius').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).withMessage('Coverage radius tidak valid'),
  body('coverage_geojson').optional({ nullable: true, checkFalsy: true }),
  body('status').optional().isIn(['Aktif', 'Non Aktif']).withMessage('Status lokasi tidak valid')
];

module.exports = {
  createLocationValidation,
  updateLocationValidation
};
