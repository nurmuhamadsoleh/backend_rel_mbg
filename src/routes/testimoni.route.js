const express = require('express');
const testimoniController = require('../controllers/testimoni.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createTestimoniValidation, updateTestimoniValidation } = require('../validations/testimoni.validation');

const router = express.Router();

router.get('/', testimoniController.index);
router.post('/', authMiddleware, uploadImage.single('photo'), createTestimoniValidation, validate, testimoniController.store);
router.put('/:id', authMiddleware, uploadImage.single('photo'), updateTestimoniValidation, validate, testimoniController.update);
router.delete('/:id', authMiddleware, testimoniController.destroy);

module.exports = router;
