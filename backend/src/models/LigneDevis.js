const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LigneDevis = sequelize.define('LigneDevis', {
  id_ligne_devis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ordre: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  quantite: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1
  },
  prix_unitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  tva: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 21.00
  },
  description_personnalisee: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_devis: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_prestation: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'ligne_devis',
  timestamps: false
});

module.exports = LigneDevis;
