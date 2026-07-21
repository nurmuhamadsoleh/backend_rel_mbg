const fs = require('fs');
const path = require('path');

function toPublicUrl(filePath) {
  if (!filePath) {
    return null;
  }

  const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  return `/${relativePath}`;
}

function toLocalPath(fileUrl) {
  if (!fileUrl || /^https?:\/\//i.test(fileUrl)) {
    return null;
  }

  return path.join(process.cwd(), fileUrl.replace(/^\/+/, ''));
}

function deleteLocalFile(fileUrl) {
  const filePath = toLocalPath(fileUrl);

  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function deleteUploadedFile(file) {
  if (file?.path) {
    deleteLocalFile(toPublicUrl(file.path));
  }
}

function deleteUploadedFiles(req) {
  if (req.file) {
    deleteUploadedFile(req.file);
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach(deleteUploadedFile);
      return;
    }

    Object.values(req.files).flat().forEach(deleteUploadedFile);
  }
}

function ensureImageSize(file, maxSize = 5 * 1024 * 1024, message = 'Ukuran image maksimal 5 MB') {
  if (file && file.mimetype.startsWith('image/') && file.size > maxSize) {
    deleteLocalFile(toPublicUrl(file.path));
    const error = new Error(message);
    error.status = 422;
    throw error;
  }
}

function ensureVideoSize(file) {
  if (file && file.mimetype === 'video/mp4' && file.size > 20 * 1024 * 1024) {
    deleteLocalFile(toPublicUrl(file.path));
    const error = new Error('Ukuran video maksimal 20 MB');
    error.status = 422;
    throw error;
  }
}

module.exports = {
  toPublicUrl,
  deleteLocalFile,
  deleteUploadedFiles,
  ensureImageSize,
  ensureVideoSize
};
