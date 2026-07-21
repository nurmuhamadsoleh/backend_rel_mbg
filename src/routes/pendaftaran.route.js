const express = require('express');
const pendaftaranController = require('../controllers/pendaftaran.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadRegistrationFiles } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createPendaftaranValidation } = require('../validations/pendaftaran.validation');

const router = express.Router();

router.post(
  '/',
  uploadRegistrationFiles.fields([
    { name: 'ktp_photo', maxCount: 1 },
    { name: 'profile_photo', maxCount: 1 }
  ]),
  createPendaftaranValidation,
  validate,
  pendaftaranController.store
);
router.get('/check-status', pendaftaranController.checkStatus);
router.get('/', authMiddleware, pendaftaranController.index);
router.get('/:id', authMiddleware, pendaftaranController.show);
router.put('/:id/verify', authMiddleware, pendaftaranController.toggleVerify);
router.put('/:id/approve', authMiddleware, pendaftaranController.toggleApprove);
router.put('/:id/kta-issued', authMiddleware, pendaftaranController.toggleKtaIssued);
router.delete('/:id', authMiddleware, pendaftaranController.destroy);

module.exports = router;
