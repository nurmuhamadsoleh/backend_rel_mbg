const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Struktur = sequelize.define('Struktur', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  position: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  photo_url: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'organization_structures'
});

module.exports = Struktur;
