const express = require('express');
const locationController = require('../controllers/location.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createLocationValidation,
  updateLocationValidation
} = require('../validations/location.validation');

const router = express.Router();

router.get('/public', locationController.publicIndex);
router.get('/', authMiddleware, locationController.index);
router.post('/', authMiddleware, uploadMiddleware.uploadImage.single('photo'), createLocationValidation, validate, locationController.store);
router.put('/:id', authMiddleware, uploadMiddleware.uploadImage.single('photo'), updateLocationValidation, validate, locationController.update);
router.delete('/:id', authMiddleware, locationController.destroy);

module.exports = router;
