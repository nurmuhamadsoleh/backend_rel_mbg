const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  flyer_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('publish', 'unpublish'),
    defaultValue: 'publish'
  }
}, {
  tableName: 'programs'
});

module.exports = Program;
