const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadGalleryFile } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createGalleryValidation, updateGalleryValidation } = require('../validations/gallery.validation');

const router = express.Router();

router.get('/', galleryController.index);
router.get('/public/articles', galleryController.publicIndex);
router.get('/public/articles/:id', galleryController.publicShow);
router.get('/:id', galleryController.show);
router.post(
  '/',
  authMiddleware,
  uploadGalleryFile.single('file'),
  createGalleryValidation,
  validate,
  galleryController.store
);
router.put(
  '/:id',
  authMiddleware,
  uploadGalleryFile.single('file'),
  updateGalleryValidation,
  validate,
  galleryController.update
);
router.delete('/:id', authMiddleware, galleryController.destroy);

module.exports = router;
