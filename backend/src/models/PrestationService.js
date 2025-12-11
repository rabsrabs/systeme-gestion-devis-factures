const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PrestationService = sequelize.define('PrestationService', {
  id_prestation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code_prestation: {
    type: DataTypes.STRING(50),
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  unite: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  prix_unitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  details_techniques: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categorie: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_modification: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'prestation_service',
  timestamps: false
});

module.exports = PrestationService;
