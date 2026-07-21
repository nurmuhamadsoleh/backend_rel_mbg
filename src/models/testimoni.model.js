const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimoni = sequelize.define('Testimoni', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(150)
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'testimonies'
});

module.exports = Testimoni;
