const express = require('express');
const anggotaController = require('../controllers/anggota.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createAnggotaValidation, updateAnggotaValidation } = require('../validations/anggota.validation');

const router = express.Router();

router.get('/', anggotaController.index);
router.get('/:id', anggotaController.show);
router.post(
  '/',
  authMiddleware,
  uploadImage.single('photo'),
  createAnggotaValidation,
  validate,
  anggotaController.store
);
router.put(
  '/:id',
  authMiddleware,
  uploadImage.single('photo'),
  updateAnggotaValidation,
  validate,
  anggotaController.update
);
router.delete('/:id', authMiddleware, anggotaController.destroy);

module.exports = router;
