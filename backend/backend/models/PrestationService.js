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
    unique: true,
    allowNull: false
  },
  nom: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categorie: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sous_categorie: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  unite: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'unité'
  },
  prix_unitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tva_applicable: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 21.00
  },
  details_techniques: {
    type: DataTypes.TEXT,
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
  timestamps: false,
  hooks: {
    beforeUpdate: (prestation) => {
      prestation.date_modification = new Date();
    }
  }
});

module.exports = PrestationService;
