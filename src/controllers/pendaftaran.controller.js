const { Op } = require('sequelize');
const QRCode = require('qrcode');
const { Anggota, Pendaftaran } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const convertToWebp = require('../utils/convertWebp');
const { deleteLocalFile, toPublicUrl } = require('../utils/file');
const { getPagination, getPagingData } = require('../utils/pagination');
const { successResponse, errorResponse } = require('../utils/response');

async function resolveRegistrationFiles(files = {}) {
  const result = {};

  if (files.ktp_photo?.[0]) {
    result.ktp_photo_url = toPublicUrl(await convertToWebp(files.ktp_photo[0].path));
  }

  if (files.profile_photo?.[0]) {
    result.profile_photo_url = toPublicUrl(await convertToWebp(files.profile_photo[0].path));
  }

  return result;
}

function parseToggleValue(currentValue, requestedValue) {
  if (typeof requestedValue === 'boolean') {
    return requestedValue;
  }

  if (requestedValue === 'true') {
    return true;
  }

  if (requestedValue === 'false') {
    return false;
  }

  return !currentValue;
}

function getRegistrationStatus(data) {
  if (data.is_kta_issued) {
    return 'kta-terbit';
  }

  if (data.is_approved) {
    return 'disetujui';
  }

  if (data.is_verified) {
    return 'verifikasi';
  }

  return 'pendaftaran';
}

function buildRegistrationLocation(data) {
  const area = [data.village, data.district, data.regency, data.province]
    .filter(Boolean)
    .join(', ');

  return data.full_address || area || '-';
}

function getDefaultValidUntil() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);

  return date.toISOString().slice(0, 10);
}

async function buildKtaQrCode(member) {
  const payload = {
    nama_anggota: member.name || '-',
    nomor_anggota: member.member_number || '-',
    status_keanggotaan: member.member_status || 'Aktif',
    masa_berlaku: member.valid_until || '-',
    lokasi: member.location || '-',
    sumber_website: 'relmbg.co.id'
  };

  return QRCode.toDataURL(JSON.stringify(payload), {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 360
  });
}

async function moveRegistrationToVolunteer(data) {
  const memberNumber = data.nik || `REG-${data.id}`;
  const payload = {
    name: data.full_name,
    location: buildRegistrationLocation(data),
    member_number: memberNumber,
    photo_url: data.profile_photo_url,
    member_status: 'Aktif',
    valid_until: getDefaultValidUntil()
  };
  const existingMember = await Anggota.findOne({
    where: {
      member_number: memberNumber
    }
  });

  if (existingMember) {
    await existingMember.update({
      ...payload,
      photo_url: data.profile_photo_url || existingMember.photo_url,
      valid_until: existingMember.valid_until || payload.valid_until
    });

    return existingMember;
  }

  return Anggota.create(payload);
}

const index = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const search = req.query.search || '';
  const where = search
    ? {
      [Op.or]: [
        { full_name: { [Op.like]: `%${search}%` } },
        { whatsapp_number: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { nik: { [Op.like]: `%${search}%` } },
        { regency: { [Op.like]: `%${search}%` } },
        { district: { [Op.like]: `%${search}%` } },
        { village: { [Op.like]: `%${search}%` } }
      ]
    }
    : {};

  const { rows, count } = await Pendaftaran.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });

  return successResponse(res, 'Data pendaftaran anggota berhasil ditampilkan', rows, getPagingData(count, page, limit));
});

const show = asyncHandler(async (req, res) => {
  const data = await Pendaftaran.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data pendaftaran anggota tidak ditemukan', [], 404);
  }

  return successResponse(res, 'Detail pendaftaran anggota berhasil ditampilkan', data);
});

const checkStatus = asyncHandler(async (req, res) => {
  const keyword = String(req.query.keyword || req.query.search || '').trim();

  if (!keyword) {
    return errorResponse(res, 'NIK atau email wajib diisi', [], 422);
  }

  const data = await Pendaftaran.findOne({
    where: {
      [Op.or]: [
        { nik: keyword },
        { email: keyword }
      ]
    },
    order: [['created_at', 'DESC']]
  });

  if (data) {
    return successResponse(res, 'Status pendaftaran anggota berhasil ditampilkan', {
      id: data.id,
      full_name: data.full_name,
      whatsapp_number: data.whatsapp_number,
      email: data.email,
      nik: data.nik,
      full_address: data.full_address,
      province: data.province,
      regency: data.regency,
      district: data.district,
      village: data.village,
      is_verified: Boolean(data.is_verified),
      is_approved: Boolean(data.is_approved),
      is_kta_issued: Boolean(data.is_kta_issued),
      status: getRegistrationStatus(data)
    });
  }

  const memberWhere = {
    [Op.or]: [
      { member_number: keyword }
    ]
  };

  if (/^[0-9]{1,10}$/.test(keyword)) {
    memberWhere[Op.or].push({ id: Number(keyword) });
  }

  const member = await Anggota.findOne({
    where: memberWhere,
    order: [['created_at', 'DESC']]
  });

  if (!member) {
    return errorResponse(res, 'Data pendaftaran tidak ditemukan', [], 404);
  }

  const qrCodeUrl = await buildKtaQrCode(member);

  return successResponse(res, 'KTA anggota REL MBG berhasil ditemukan', {
    id: member.id,
    full_name: member.name,
    member_number: member.member_number,
    member_status: member.member_status,
    valid_until: member.valid_until,
    full_address: member.location,
    photo_url: member.photo_url,
    qr_code_url: qrCodeUrl,
    qr_payload: {
      nama_anggota: member.name || '-',
      nomor_anggota: member.member_number || '-',
      status_keanggotaan: member.member_status || 'Aktif',
      masa_berlaku: member.valid_until || '-',
      lokasi: member.location || '-',
      sumber_website: 'relmbg.co.id'
    },
    is_verified: true,
    is_approved: true,
    is_kta_issued: true,
    status: 'kta-terbit'
  });
});

const store = asyncHandler(async (req, res) => {
  const fileData = await resolveRegistrationFiles(req.files);
  const data = await Pendaftaran.create({
    full_name: req.body.full_name,
    whatsapp_number: req.body.whatsapp_number,
    email: req.body.email,
    nik: req.body.nik,
    full_address: req.body.full_address,
    province: req.body.province,
    regency: req.body.regency,
    district: req.body.district,
    village: req.body.village,
    is_verified: false,
    is_approved: false,
    is_kta_issued: false,
    ...fileData
  });

  return successResponse(res, 'Pendaftaran anggota berhasil dikirim', data, undefined, 201);
});

const toggleVerify = asyncHandler(async (req, res) => {
  const data = await Pendaftaran.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data pendaftaran anggota tidak ditemukan', [], 404);
  }

  const nextValue = parseToggleValue(data.is_verified, req.body.value);

  if (!nextValue && (data.is_approved || data.is_kta_issued)) {
    return errorResponse(
      res,
      'Approval dan penerbitan KTA harus dinonaktifkan sebelum menonaktifkan verifikasi',
      [],
      422
    );
  }

  await data.update({ is_verified: nextValue });

  return successResponse(res, 'Status verifikasi berhasil diperbarui', data);
});

const toggleApprove = asyncHandler(async (req, res) => {
  const data = await Pendaftaran.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data pendaftaran anggota tidak ditemukan', [], 404);
  }

  const nextValue = parseToggleValue(data.is_approved, req.body.value);

  if (nextValue && !data.is_verified) {
    return errorResponse(res, 'Verifikasi harus diaktifkan sebelum approval', [], 422);
  }

  if (!nextValue && data.is_kta_issued) {
    return errorResponse(res, 'Penerbitan KTA harus dinonaktifkan sebelum menonaktifkan approval', [], 422);
  }

  await data.update({ is_approved: nextValue });

  return successResponse(res, 'Status approve berhasil diperbarui', data);
});

const toggleKtaIssued = asyncHandler(async (req, res) => {
  const data = await Pendaftaran.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data pendaftaran anggota tidak ditemukan', [], 404);
  }

  const nextValue = parseToggleValue(data.is_kta_issued, req.body.value);

  if (!nextValue) {
    await data.update({ is_kta_issued: false });
    return successResponse(res, 'Status KTA terbit berhasil diperbarui', data);
  }

  if (!data.is_verified) {
    return errorResponse(res, 'Verifikasi harus diaktifkan sebelum penerbitan KTA', [], 422);
  }

  if (!data.is_approved) {
    return errorResponse(res, 'Approval harus diaktifkan sebelum penerbitan KTA', [], 422);
  }

  await data.update({ is_kta_issued: true });

  const volunteer = await moveRegistrationToVolunteer(data);

  deleteLocalFile(data.ktp_photo_url);
  await data.destroy();

  return successResponse(res, 'KTA terbit. Data pendaftaran berhasil dipindahkan ke Anggota Relawan SSPG', volunteer);
});

const destroy = asyncHandler(async (req, res) => {
  const data = await Pendaftaran.findByPk(req.params.id);

  if (!data) {
    return errorResponse(res, 'Data pendaftaran anggota tidak ditemukan', [], 404);
  }

  deleteLocalFile(data.ktp_photo_url);
  deleteLocalFile(data.profile_photo_url);
  await data.destroy();

  return successResponse(res, 'Data pendaftaran anggota berhasil dihapus', null);
});

module.exports = {
  index,
  show,
  checkStatus,
  store,
  toggleVerify,
  toggleApprove,
  toggleKtaIssued,
  destroy
};
