const express = require('express');
const organizationInfoController = require('../controllers/organization-info.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createOrganizationInfoValidation,
  updateOrganizationInfoValidation
} = require('../validations/organization-info.validation');

const router = express.Router();

router.get('/', organizationInfoController.index);
router.post('/', authMiddleware, createOrganizationInfoValidation, validate, organizationInfoController.store);
router.put('/:id', authMiddleware, updateOrganizationInfoValidation, validate, organizationInfoController.update);
router.delete('/:id', authMiddleware, organizationInfoController.destroy);

module.exports = router;
