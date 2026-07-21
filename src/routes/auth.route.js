const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { loginRateLimiter } = require('../middlewares/security.middleware');
const { uploadProfileImage } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { loginValidation, registerValidation, updateProfileValidation } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginRateLimiter, loginValidation, validate, authController.login);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, uploadProfileImage.single('photo'), updateProfileValidation, validate, authController.updateProfile);

module.exports = router;
