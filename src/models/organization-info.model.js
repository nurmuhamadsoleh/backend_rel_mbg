const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrganizationInfo = sequelize.define('OrganizationInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(160),
    allowNull: false,
    defaultValue: 'Kantor Serikat REL MBG'
  },
  office_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  maps_embed: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'organization_infos'
});

module.exports = OrganizationInfo;
