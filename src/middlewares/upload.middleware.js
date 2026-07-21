const path = require('path');
const multer = require('multer');

function makeMulterError(message) {
  const error = new Error(message);
  error.status = 422;
  return error;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
      cb(null, 'uploads/videos');
      return;
    }

    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
  }
});

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const MAX_PROFILE_UPLOAD_SIZE = 2 * 1024 * 1024;
const MAX_GALLERY_UPLOAD_SIZE = 20 * 1024 * 1024;
const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function getExtension(fileName = '') {
  return path.extname(fileName).toLowerCase();
}

function fileFilter(allowedTypes, message) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(makeMulterError(message));
      return;
    }

    cb(null, true);
  };
}

function galleryFileFilter(req, file, cb) {
  const extension = getExtension(file.originalname);
  const isImage = imageTypes.includes(file.mimetype) && imageExtensions.includes(extension);
  const isVideo = file.mimetype === 'video/mp4' && extension === '.mp4';

  if (!isImage && !isVideo) {
    cb(makeMulterError('Format file harus image jpg/jpeg/png/webp atau video mp4'));
    return;
  }

  cb(null, true);
}

function imageFileFilter(req, file, cb) {
  const extension = getExtension(file.originalname);
  const isImage = imageTypes.includes(file.mimetype) && imageExtensions.includes(extension);

  if (!isImage) {
    cb(makeMulterError('Format image harus jpg, jpeg, png, atau webp'));
    return;
  }

  cb(null, true);
}

const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: imageFileFilter
});

const uploadProfileImage = multer({
  storage,
  limits: { fileSize: MAX_PROFILE_UPLOAD_SIZE },
  fileFilter: fileFilter(imageTypes, 'Format photo profil harus jpg, jpeg, png, atau webp')
});

const uploadGalleryFile = multer({
  storage,
  limits: { fileSize: MAX_GALLERY_UPLOAD_SIZE },
  fileFilter: galleryFileFilter
});

const uploadRegistrationFiles = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: fileFilter(imageTypes, 'Format photo harus jpg, jpeg, png, atau webp')
});

module.exports = {
  uploadImage,
  uploadProfileImage,
  uploadGalleryFile,
  uploadRegistrationFiles
};
