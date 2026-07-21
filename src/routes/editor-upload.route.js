const express = require('express');
const editorUploadController = require('../controllers/editor-upload.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/images', authMiddleware, uploadImage.single('upload'), editorUploadController.uploadImage);

module.exports = router;
