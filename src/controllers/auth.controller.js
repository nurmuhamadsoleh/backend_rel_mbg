const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, ensureImageSize, toPublicUrl } = require('../utils/file');
const { successResponse, errorResponse } = require('../utils/response');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'relmbg_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

const register = asyncHandler(async (req, res) => {
  const existingUser = await User.scope('withPassword').findOne({
    where: { email: req.body.email }
  });

  if (existingUser) {
    return errorResponse(res, 'Email sudah terdaftar', [], 409);
  }

  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password,
    role: req.body.role || 'admin'
  });

  return successResponse(res, 'Registrasi berhasil', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }, undefined, 201);
});

const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  const user = await User.scope('withPassword').findOne({
    where: { email }
  });

  if (!user) {
    return errorResponse(res, 'Email atau password salah', [], 401);
  }

  const passwordValid = await bcrypt.compare(req.body.password, user.password);

  if (!passwordValid) {
    return errorResponse(res, 'Email atau password salah', [], 401);
  }

  return successResponse(res, 'Login berhasil', {
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo_url: user.photo_url
    }
  });
});

const me = asyncHandler(async (req, res) => {
  return successResponse(res, 'Data user berhasil ditampilkan', req.user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.scope('withPassword').findByPk(req.user.id);

  if (!user) {
    return errorResponse(res, 'User tidak ditemukan', [], 404);
  }

  let nextPhotoUrl = user.photo_url;

  if (req.file) {
    ensureImageSize(req.file, 2 * 1024 * 1024, 'Ukuran photo profil maksimal 2 MB');
    const webpPath = await convertToWebp(req.file.path);
    nextPhotoUrl = toPublicUrl(webpPath);

    if (user.photo_url) {
      deleteLocalFile(user.photo_url);
    }
  }

  const payload = {
    name: req.body.name,
    photo_url: nextPhotoUrl
  };

  if (req.body.password) {
    payload.password = await bcrypt.hash(req.body.password, 10);
  }

  await user.update(payload);
  await user.reload();

  return successResponse(res, 'Profil admin berhasil diperbarui', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo_url: user.photo_url
  });
});

module.exports = {
  register,
  login,
  me,
  updateProfile
};
