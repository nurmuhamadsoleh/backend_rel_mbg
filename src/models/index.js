const sequelize = require('../config/database');
const User = require('./user.model');
const Category = require('./category.model');
const Gallery = require('./gallery.model');
const Testimoni = require('./testimoni.model');
const Contact = require('./contact.model');
const OrganizationInfo = require('./organization-info.model');
const Location = require('./location.model');
const Struktur = require('./struktur.model');
const Anggota = require('./anggota.model');
const Pendaftaran = require('./pendaftaran.model');
const Program = require('./program.model');

Category.hasMany(Gallery, {
  foreignKey: 'category_id',
  as: 'galleries',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Gallery.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

module.exports = {
  sequelize,
  User,
  Category,
  Gallery,
  Testimoni,
  Contact,
  OrganizationInfo,
  Location,
  Struktur,
  Anggota,
  Pendaftaran,
  Program
};
