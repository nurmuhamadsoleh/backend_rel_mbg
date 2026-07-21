const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('DPW', 'DPD', 'DPC', 'PAC'),
    allowNull: false,
    defaultValue: 'DPC'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  province_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  province_name: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  city_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  city_name: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  district_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  district_name: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  village_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  village_name: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  coverage_radius: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  coverage_geojson: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Aktif', 'Non Aktif'),
    allowNull: false,
    defaultValue: 'Aktif'
  }
}, {
  tableName: 'locations'
});

module.exports = Location;
