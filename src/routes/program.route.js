const express = require('express');
const programController = require('../controllers/program.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProgramValidation, updateProgramValidation } = require('../validations/program.validation');

const router = express.Router();

router.get('/', programController.index);
router.get('/public', programController.publicIndex);
router.get('/:id', programController.show);
router.post(
  '/',
  authMiddleware,
  uploadImage.single('flyer'),
  createProgramValidation,
  validate,
  programController.store
);
router.put(
  '/:id',
  authMiddleware,
  uploadImage.single('flyer'),
  updateProgramValidation,
  validate,
  programController.update
);
router.delete('/:id', authMiddleware, programController.destroy);

module.exports = router;
