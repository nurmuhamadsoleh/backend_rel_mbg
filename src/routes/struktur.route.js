const express = require('express');
const strukturController = require('../controllers/struktur.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createStrukturValidation, updateStrukturValidation } = require('../validations/struktur.validation');

const router = express.Router();

router.get('/', strukturController.index);
router.post(
  '/',
  authMiddleware,
  uploadImage.single('photo'),
  createStrukturValidation,
  validate,
  strukturController.store
);
router.put(
  '/:id',
  authMiddleware,
  uploadImage.single('photo'),
  updateStrukturValidation,
  validate,
  strukturController.update
);
router.delete('/:id', authMiddleware, strukturController.destroy);

module.exports = router;
