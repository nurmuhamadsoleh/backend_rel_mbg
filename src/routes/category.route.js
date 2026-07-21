const express = require('express');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createCategoryValidation, updateCategoryValidation } = require('../validations/category.validation');

const router = express.Router();

router.get('/', categoryController.index);
router.get('/:id', categoryController.show);
router.post('/', authMiddleware, createCategoryValidation, validate, categoryController.store);
router.put('/:id', authMiddleware, updateCategoryValidation, validate, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.destroy);

module.exports = router;
