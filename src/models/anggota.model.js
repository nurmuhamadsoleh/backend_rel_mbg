const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anggota = sequelize.define('Anggota', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(150)
  },
  member_number: {
    type: DataTypes.STRING(80),
    unique: true
  },
  photo_url: {
    type: DataTypes.STRING(255)
  },
  member_status: {
    type: DataTypes.ENUM('Aktif', 'Non Aktif'),
    defaultValue: 'Aktif'
  },
  valid_until: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'volunteers'
});

module.exports = Anggota;
