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
    allowNull: false
  },
  prix_unitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
    allowNull: false,
    references: {
      model: 'devis',
      key: 'id_devis'
    }
  },
  id_prestation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'prestation_service',
      key: 'id_prestation'
    }
  }
}, {
  tableName: 'ligne_devis',
  timestamps: false
});

// Calcul du total de la ligne (virtuel)
LigneDevis.prototype.calculerTotal = function() {
  return parseFloat(this.quantite) * parseFloat(this.prix_unitaire);
};

module.exports = LigneDevis;
