const express = require('express');
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createContactValidation } = require('../validations/contact.validation');

const router = express.Router();

router.post('/', createContactValidation, validate, contactController.store);
router.get('/', authMiddleware, contactController.index);
router.get('/:id', authMiddleware, contactController.show);
router.delete('/:id', authMiddleware, contactController.destroy);

module.exports = router;
