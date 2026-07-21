const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const galleryRoute = require('./gallery.route');
const testimoniRoute = require('./testimoni.route');
const contactRoute = require('./contact.route');
const organizationInfoRoute = require('./organization-info.route');
const locationRoute = require('./location.route');
const editorUploadRoute = require('./editor-upload.route');
const strukturRoute = require('./struktur.route');
const anggotaRoute = require('./anggota.route');
const pendaftaranRoute = require('./pendaftaran.route');
const programRoute = require('./program.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/categories', categoryRoute);
router.use('/galleries', galleryRoute);
router.use('/testimonies', testimoniRoute);
router.use('/contacts', contactRoute);
router.use('/organization-infos', organizationInfoRoute);
router.use('/locations', locationRoute);
router.use('/editor-assets', editorUploadRoute);
router.use('/organization-structures', strukturRoute);
router.use('/volunteers', anggotaRoute);
router.use('/registrations', pendaftaranRoute);
router.use('/programs', programRoute);

module.exports = router;
