const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pendaftaran = sequelize.define('Pendaftaran', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  whatsapp_number: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(120),
    validate: {
      isEmail: true
    }
  },
  nik: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  full_address: {
    type: DataTypes.TEXT
  },
  province: {
    type: DataTypes.STRING(120)
  },
  regency: {
    type: DataTypes.STRING(120)
  },
  district: {
    type: DataTypes.STRING(120)
  },
  village: {
    type: DataTypes.STRING(120)
  },
  ktp_photo_url: {
    type: DataTypes.STRING(255)
  },
  profile_photo_url: {
    type: DataTypes.STRING(255)
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_kta_issued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'registrations'
});

module.exports = Pendaftaran;
