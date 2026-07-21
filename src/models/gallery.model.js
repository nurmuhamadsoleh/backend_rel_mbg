const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  short_description: {
    type: DataTypes.STRING(255)
  },
  content: {
    type: DataTypes.TEXT('long')
  },
  file_type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  meta_description: {
    type: DataTypes.STRING(255)
  },
  meta_keywords: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.ENUM('publish', 'unpublish'),
    defaultValue: 'unpublish'
  }
}, {
  tableName: 'galleries'
});

module.exports = Gallery;
